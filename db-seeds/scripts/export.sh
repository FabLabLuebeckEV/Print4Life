#!bin/sh

# example (exectued in folder 'db-seeds'): bash scripts/export.sh localhost 27017 iot-fablab-dev

mongodump -h $1 -p $2 -d $3