#!bin/sh

echo "exporting from $1 collection: $2"
mongo ${1} --eval "db.${2}.find({}, {_id:0, __v:0}).forEach(printjson);" > ${2}-export.json
node jsonify.js ${2}-export.json > ../${2}.json
rm ${2}-export.json