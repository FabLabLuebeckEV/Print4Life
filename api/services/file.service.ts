import * as mongodb from 'mongodb';
import * as mongoose from 'mongoose';
import { Readable } from 'stream';
/* eslint-disable no-unused-vars */
import { IError, ErrorType } from './router.service';
/* eslint-disable no-unused-vars */

/* eslint-disable class-methods-use-this */

export class FileService {
  public deleteFile (fileId: string, bucketName: string, order: any): Promise<{ order: any }> {
    let error: IError;
    return new Promise((resolve, reject) => {
      let fileID;
      try {
        fileID = mongoose.Types.ObjectId(fileId);
      } catch (err) {
        error = {
          name: 'DOWNLOAD_FILE_ERROR',
          message: 'Invalid fileID in URL parameter. '
            + 'Must be a single String of 12 bytes or a string of 24 hex characters',
          stack: err.stack,
          type: ErrorType.DOWNLOAD_FILE_ERROR
        };
        reject(error);
      }

      const bucket = new mongodb.GridFSBucket(mongoose.connection.db, {
        bucketName
      });

      try {
        bucket.delete(fileID, async (err) => {
          if (err) {
            error = {
              name: 'DELETE_FILE_ERROR',
              message: `Could not delete file with id ${fileId}`,
              stack: err.stack,
              type: ErrorType.DELETE_FILE_ERROR
            };
            reject(error);
          } else {
            const result = await bucket.find({ _id: fileId });
            if (result) {
              result.toArray((err, files) => {
                if (err) {
                  error = {
                    name: 'DELETE_FILE_ERROR',
                    message: `Could not delete file with id ${fileId}`,
                    stack: err.stack,
                    type: ErrorType.DELETE_FILE_ERROR
                  };
                  reject(error);
                } else if (files && !files.length) {
                  const file = order.files.find((elem) => elem.id === fileId);
                  order.files = order.files.filter((elem) => elem.id !== file.id);
                  let oldFiles = order.files.filter((elem) => elem.filename === file.filename);
                  if (oldFiles && oldFiles.length) {
                    oldFiles = oldFiles.sort((a, b) => {
                      if (a.createdAt >= b.createdAt) {
                        return -1;
                      }
                      return 1;
                    });
                    order.files.forEach((elem) => {
                      if (elem.id === oldFiles[0].id) {
                        elem.deprecated = false;
                      }
                    });
                  }
                  resolve({ order });
                }
              });
            }
          }
        });
      } catch (err) {
        error = {
          name: 'DOWNLOAD_FILE_ERROR',
          message: 'Invalid fileID in URL parameter. '
            + 'Must be a single String of 12 bytes or a string of 24 hex characters',
          stack: err.stack,
          type: ErrorType.DOWNLOAD_FILE_ERROR
        };
        reject(error);
      }
    });
  }

  public downloadFile (fileId, bucketName): Promise<Object> {
    let error: IError;
    return new Promise((resolve, reject) => {
      let fileID;
      try {
        fileID = mongoose.Types.ObjectId(fileId);
      } catch (err) {
        error = {
          name: 'DOWNLOAD_FILE_ERROR',
          message: 'Invalid fileID in URL parameter. '
            + 'Must be a single String of 12 bytes or a string of 24 hex characters',
          stack: err.stack,
          type: ErrorType.DOWNLOAD_FILE_ERROR
        };
        reject(error);
      }

      const bucket = new mongodb.GridFSBucket(mongoose.connection.db, {
        bucketName
      });

      try {
        resolve(bucket.openDownloadStream(fileID));
      } catch (err) {
        error = {
          name: 'DOWNLOAD_FILE_ERROR',
          message: 'Invalid fileID in URL parameter. '
            + 'Must be a single String of 12 bytes or a string of 24 hex characters',
          stack: err.stack,
          type: ErrorType.DOWNLOAD_FILE_ERROR
        };
        reject(error);
      }
    });
  }

  public uploadFile (file, bucketName, foreignId) {
    return new Promise((resolve, reject) => {
      const readableTrackStream = new Readable();
      readableTrackStream.push(file.buffer);
      readableTrackStream.push(null);
      const bucket = new mongodb.GridFSBucket(mongoose.connection.db, {
        bucketName
      });
      const uploadStream = bucket.openUploadStream(file.originalname);
      // optional metadata
      uploadStream.options.metadata = {
        orderID: foreignId,
        contentType: file.mimetype,
        deprecated: false
      };

      readableTrackStream.pipe(uploadStream);

      uploadStream.on('error',
        (error) => {
          const err: IError = {
            name: 'UPLOAD_FILE_ERROR',
            type: ErrorType.UPLOAD_FILE_ERROR,
            message: 'Error uploading file',
            stack: error.stack
          };
          reject(err);
        });

      uploadStream.on('finish',
        () => {
          const fileId = mongoose.Types.ObjectId(uploadStream.id).toString();
          const createdAt = new Date(mongoose.Types.ObjectId(uploadStream.id).getTimestamp());
          resolve(
            {
              success: true,
              fileId,
              contentType: uploadStream.options.metadata.contentType,
              filename: uploadStream.filename,
              createdAt
            }
          );
        });
    });
  }
}
/* eslint-enable class-methods-use-this */

export default FileService;
