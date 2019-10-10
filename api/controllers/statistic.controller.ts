/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import { IError, ErrorType } from '../services/router.service';
import { StatisticService } from '../services/statistic.service';
import logger from '../logger';
/* eslint-enable no-unused-vars */

const statisticService = new StatisticService();

/**
* @api {post} /api/v1/statistics/ordersByDate Returns the orders of the specific dates.
* @apiName GetOrderByDate
* @apiVersion 1.0.0
* @apiGroup Statistics
* @apiHeader (Needed Request Headers) {String} Content-Type application/json
* @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
*
* @apiParam {String} startDate is the start date to filter by.
* Start Date filters starting and including the start date. (one date is mandatory)
* @apiParam {String} endDate is the end date to filter by.
* End Date filters up to the end date but not including. (one date is mandatory)
* @apiParamExample {json} Request-Example:
*
{
  "startDate": "2018-01-01",
  "endDate": "2018-12-31"
}
* @apiSuccess {Object} statistics is the statistics object
* @apiSuccessExample Success-Response:
*    HTTP/1.1 200 OK
{
  "statistics": {
      "fablabs": [
          {
              "name": "FabLab Lübeck",
              "orders": {
                  "completed": [
                      {
                          "machine": {
                              "_id": "5b55f7bf3fe0c8b01713b3ee",
                              "type": "millingMachine"
                          },
                          "status": "completed",
                          "shared": false,
                          "fileCopyright": true,
                          "_id": "5c18b91617ced51c3e6080e1",
                          "fablabId": "5b453ddb5cf4a9574849e98e",
                          "projectname": "Test Edited",
                          "owner": "5c18b49517ced51c3e6080df",
                          "files": [
                              {
                                  "deprecated": false,
                                  "id": "5c18bc8f17ced51c3e608101",
                                  "contentType": "text/plain",
                                  "filename": "PhoenixShugenjaLion.txt",
                                  "createdAt": "2018-12-18T09:23:27.000Z"
                              },
                              {
                                  "deprecated": false,
                                  "id": "5c18bc8f17ced51c3e608102",
                                  "contentType": "text/plain",
                                  "filename": "PhoenixShugenja.txt",
                                  "createdAt": "2018-12-18T09:23:27.000Z"
                              },
                              {
                                  "deprecated": false,
                                  "id": "5c18bc8f17ced51c3e608103",
                                  "contentType": "text/plain",
                                  "filename": "PhoenixHonorDestruction.txt",
                                  "createdAt": "2018-12-18T09:23:27.000Z"
                              },
                              {
                                  "deprecated": false,
                                  "id": "5c18bc8f17ced51c3e608104",
                                  "contentType": "text/plain",
                                  "filename": "PhoenixCourtierLion.txt",
                                  "createdAt": "2018-12-18T09:23:27.000Z"
                              },
                              {
                                  "deprecated": false,
                                  "id": "5c18bc8f17ced51c3e608105",
                                  "contentType": "text/plain",
                                  "filename": "PhoenixCourtier.txt",
                                  "createdAt": "2018-12-18T09:23:27.000Z"
                              },
                              {
                                  "deprecated": false,
                                  "id": "5c18bc8f17ced51c3e608106",
                                  "contentType": "text/plain",
                                  "filename": "LionCrane.txt",
                                  "createdAt": "2018-12-18T09:23:27.000Z"
                              },
                              {
                                  "deprecated": false,
                                  "id": "5c18bc8f17ced51c3e608107",
                                  "contentType": "text/plain",
                                  "filename": "LionCrab.txt",
                                  "createdAt": "2018-12-18T09:23:27.000Z"
                              },
                              {
                                  "deprecated": false,
                                  "id": "5c18bc8f17ced51c3e608108",
                                  "contentType": "text/plain",
                                  "filename": "CrabPeople.txt",
                                  "createdAt": "2018-12-18T09:23:27.000Z"
                              }
                          ],
                          "shippingAddress": {
                              "street": "Drosselweg, 7",
                              "zipCode": "23628",
                              "city": "Klempau",
                              "country": "Deutschland"
                          },
                          "comments": [
                              {
                                  "_id": "5c18b91617ced51c3e6080e2",
                                  "content": "asdads",
                                  "author": "5c18b49517ced51c3e6080df",
                                  "createdAt": "2018-12-18T09:08:38.622Z"
                              },
                              {
                                  "_id": "5c18bc5317ced51c3e6080fa",
                                  "author": "5c18b49517ced51c3e6080df",
                                  "content": "asad",
                                  "createdAt": "2018-12-18T09:22:27.446Z"
                              }
                          ],
                          "token": "920b82af-005b-437e-9039-ed536e80f417",
                          "createdAt": "2018-12-18T09:08:38.622Z"
                          "editor": "5c18b4b417ced51c3e6080e0"
                      }
                  ],
                  "new": [
                      {
                          "machine": {
                              "type": "unknown",
                              "_id": "unknown"
                          },
                          "status": "new",
                          "shared": true,
                          "fileCopyright": true,
                          "_id": "5c18b93d17ced51c3e6080e7",
                          "fablabId": "5b453ddb5cf4a9574849e98e",
                          "projectname": "Test Shared",
                          "comments": [
                              {
                                  "_id": "5c18b93d17ced51c3e6080e8",
                                  "author": "5c18b93d17ced51c3e6080e6",
                                  "content": "asdad",
                                  "createdAt": "2018-12-18T09:09:17.772Z"
                              }
                          ],
                          "owner": "5c18b93d17ced51c3e6080e6",
                          "files": [
                              {
                                  "deprecated": false,
                                  "id": "5c18b95b17ced51c3e6080ed",
                                  "contentType": "text/plain",
                                  "filename": "PhoenixShugenjaLion.txt",
                                  "createdAt": "2018-12-18T09:09:47.000Z"
                              }
                          ],
                          "shippingAddress": {
                              "street": "Drosselweg, 7",
                              "zipCode": "23628",
                              "city": "Klempau",
                              "country": "Deutschland"
                          },
                          "token": "520e16ce-127d-4098-b73d-0b31560cde09",
                          "createdAt": "2018-12-18T09:09:17.772Z"
                      },
                      {
                          "machine": {
                              "_id": "5b55f7bf3fe0c8b01713b3ee",
                              "type": "millingMachine"
                          },
                          "status": "new",
                          "shared": false,
                          "fileCopyright": false,
                          "_id": "5c18bea417ced51c3e60812c",
                          "fablabId": "5b453ddb5cf4a9574849e98e",
                          "projectname": "Test",
                          "comments": [
                              {
                                  "_id": "5c18bea417ced51c3e60812d",
                                  "author": "5c18b4b417ced51c3e6080e0",
                                  "content": "asdad",
                                  "createdAt": "2018-12-18T09:32:20.137Z"
                              }
                          ],
                          "owner": "5c18b4b417ced51c3e6080e0",
                          "files": [],
                          "shippingAddress": {
                              "street": "Maria-Goeppert-Straße 1",
                              "zipCode": "23562",
                              "city": "Lübeck",
                              "country": "Germany"
                          },
                          "token": "7104583e-25f6-46cd-a122-d87942277c4f",
                          "createdAt": "2018-12-18T09:32:20.137Z"
                      }
                  ]
              }
          }
      ],
      "machines": {
          "millingMachine": [
              {
                  "deviceName": "PFU-S-2 1510-G",
                  "id": "5b55f7bf3fe0c8b01713b3ee",
                  "fablabId": "5b453ddb5cf4a9574849e98e",
                  "orders": {
                      "completed": [
                          {
                              "machine": {
                                  "_id": "5b55f7bf3fe0c8b01713b3ee",
                                  "type": "millingMachine"
                              },
                              "status": "completed",
                              "shared": false,
                              "fileCopyright": true,
                              "_id": "5c18b91617ced51c3e6080e1",
                              "fablabId": "5b453ddb5cf4a9574849e98e",
                              "projectname": "Test Edited",
                              "owner": "5c18b49517ced51c3e6080df",
                              "files": [
                                  {
                                      "deprecated": false,
                                      "id": "5c18bc8f17ced51c3e608101",
                                      "contentType": "text/plain",
                                      "filename": "PhoenixShugenjaLion.txt",
                                      "createdAt": "2018-12-18T09:23:27.000Z"
                                  },
                                  {
                                      "deprecated": false,
                                      "id": "5c18bc8f17ced51c3e608102",
                                      "contentType": "text/plain",
                                      "filename": "PhoenixShugenja.txt",
                                      "createdAt": "2018-12-18T09:23:27.000Z"
                                  },
                                  {
                                      "deprecated": false,
                                      "id": "5c18bc8f17ced51c3e608103",
                                      "contentType": "text/plain",
                                      "filename": "PhoenixHonorDestruction.txt",
                                      "createdAt": "2018-12-18T09:23:27.000Z"
                                  },
                                  {
                                      "deprecated": false,
                                      "id": "5c18bc8f17ced51c3e608104",
                                      "contentType": "text/plain",
                                      "filename": "PhoenixCourtierLion.txt",
                                      "createdAt": "2018-12-18T09:23:27.000Z"
                                  },
                                  {
                                      "deprecated": false,
                                      "id": "5c18bc8f17ced51c3e608105",
                                      "contentType": "text/plain",
                                      "filename": "PhoenixCourtier.txt",
                                      "createdAt": "2018-12-18T09:23:27.000Z"
                                  },
                                  {
                                      "deprecated": false,
                                      "id": "5c18bc8f17ced51c3e608106",
                                      "contentType": "text/plain",
                                      "filename": "LionCrane.txt",
                                      "createdAt": "2018-12-18T09:23:27.000Z"
                                  },
                                  {
                                      "deprecated": false,
                                      "id": "5c18bc8f17ced51c3e608107",
                                      "contentType": "text/plain",
                                      "filename": "LionCrab.txt",
                                      "createdAt": "2018-12-18T09:23:27.000Z"
                                  },
                                  {
                                      "deprecated": false,
                                      "id": "5c18bc8f17ced51c3e608108",
                                      "contentType": "text/plain",
                                      "filename": "CrabPeople.txt",
                                      "createdAt": "2018-12-18T09:23:27.000Z"
                                  }
                              ],
                              "shippingAddress": {
                                  "street": "Drosselweg, 7",
                                  "zipCode": "23628",
                                  "city": "Klempau",
                                  "country": "Deutschland"
                              },
                              "comments": [
                                  {
                                      "_id": "5c18b91617ced51c3e6080e2",
                                      "content": "asdads",
                                      "author": "5c18b49517ced51c3e6080df",
                                      "createdAt": "2018-12-18T09:08:38.622Z"
                                  },
                                  {
                                      "_id": "5c18bc5317ced51c3e6080fa",
                                      "author": "5c18b49517ced51c3e6080df",
                                      "content": "asad",
                                      "createdAt": "2018-12-18T09:22:27.446Z"
                                  }
                              ],
                              "token": "920b82af-005b-437e-9039-ed536e80f417",
                              "createdAt": "2018-12-18T09:08:38.622Z,
                              "editor": "5c18b4b417ced51c3e6080e0"
                          }
                      ],
                      "new": [
                          {
                              "machine": {
                                  "_id": "5b55f7bf3fe0c8b01713b3ee",
                                  "type": "millingMachine"
                              },
                              "status": "new",
                              "shared": false,
                              "fileCopyright": false,
                              "_id": "5c18bea417ced51c3e60812c",
                              "fablabId": "5b453ddb5cf4a9574849e98e",
                              "projectname": "Test",
                              "comments": [
                                  {
                                      "_id": "5c18bea417ced51c3e60812d",
                                      "author": "5c18b4b417ced51c3e6080e0",
                                      "content": "asdad",
                                      "createdAt": "2018-12-18T09:32:20.137Z"
                                  }
                              ],
                              "owner": "5c18b4b417ced51c3e6080e0",
                              "files": [],
                              "shippingAddress": {
                                  "street": "Maria-Goeppert-Straße 1",
                                  "zipCode": "23562",
                                  "city": "Lübeck",
                                  "country": "Germany"
                              },
                              "token": "7104583e-25f6-46cd-a122-d87942277c4f",
                              "createdAt": "2018-12-18T09:32:20.137Z"
                          }
                      ]
                  }
              }
          ]
      }
  }
}
* @apiSuccessExample Success-Response:
*    HTTP/1.1 204 No Content
*
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Request! The request needs to have at least a start or end date!",
      "type": 14
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "name": "SERVER_ERROR",
      "message": "Something went wrong while getting the orders by date, machine and fablab!",
      "type": 13,
      "stack": {
          ...
      }
  }
* @apiPermission loggedIn
*/
async function getOrdersByDate (req: Request, res: Response) {
  if (req.body.startDate || req.body.endDate) {
    try {
      const startDate = req.body.startDate ? new Date(req.body.startDate) : undefined;
      const endDate = req.body.endDate ? new Date(req.body.endDate) : undefined;
      const statistics = await statisticService.getOrdersByDate(
        startDate, endDate
      );
      if (statistics) {
        logger.info(`Got statistics for date ${startDate} and ${endDate}`);
        return res.status(200).send({ statistics });
      }
      logger.info(`Got no results for date ${startDate} and ${endDate}`);
      return res.status(204).send();
    } catch (err) {
      const error: IError = {
        name: 'SERVER_ERROR',
        message: 'Something went wrong while getting the orders by date, machine and fablab!',
        type: ErrorType.SERVER_ERROR,
        stack: err.stack
      };
      logger.error(error);
      return res.status(500).send(error);
    }
  }
  const error: IError = {
    name: 'MALFORMED_REQUEST',
    message: 'Malformed Request! The request needs to have at least a start or end date!',
    type: ErrorType.MALFORMED_REQUEST
  };
  logger.error(error);
  return res.status(400).send(error);
}

export default { getOrdersByDate };
