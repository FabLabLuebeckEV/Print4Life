#!bin/sh

# example (exectued in folder 'db-seeds/scripts'): bash export.sh localhost:27017/iot-fablab-dev

bash create-seeds.sh $1 fablabs

bash create-seeds.sh $1 lasercuttercanlasertypes

bash create-seeds.sh $1 lasercutters

bash create-seeds.sh $1 millingmachines

bash create-seeds.sh $1 othermachines

bash create-seeds.sh $1 printercanmaterials

bash create-seeds.sh $1 printermaterials

bash create-seeds.sh $1 printers