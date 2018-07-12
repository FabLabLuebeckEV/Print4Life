#!bin/sh

# example (exectued in folder 'db-seeds/scripts'): bash import.sh localhost:27017 test-db

find ../ -maxdepth 1 -type f | while read line; do
    stripDir="${line##*/}"
    collection="${stripDir%.*}"
    mongoimport --host $1 --db $2 --collection $collection --type json --file ../$collection.json --jsonArray
done

