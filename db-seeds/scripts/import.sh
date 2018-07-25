#!bin/sh

# example (exectued in folder 'db-seeds'): bash scripts/import.sh localhost 27017 test-db dump/iot-fablab-dev

mongorestore -h $1 -p $2 -d $3 $4