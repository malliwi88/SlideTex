#!/bin/sh
# Deploys a working SlideTex.zip file which have to be a working instance folder

HOST='slidetex.net'
USER='root'
SERVER_DIR='/var/www/slidetex.net'

RED=' --------------------------------\n\033[0;31m'
NC='\033[0m\n --------------------------------\n' # No Color
printf "${RED}Create a build for deploying${NC}"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

echo Clean up tmp dir
rm -rf tmp

echo Create build
grunt copy:deployBuild

echo Zip build
cd tmp
zip -r -q -X deploy.zip SlideTex
cd ..

echo Transfer zip to server
scp tmp/deploy.zip ${USER}@${HOST}:${SERVER_DIR}

echo Clean up tmp dir
rm -rf tmp


printf "${RED}Deploying on ${HOST} STARTING${NC}"

ssh -t -t ${USER}@${HOST} <<ENDSSH

cd $SERVER_DIR

echo Ensure all needed dirs exist
mkdir old_instances
mkdir Persistence
mkdir SlideTex
mkdir logs

echo Extracting
unzip deploy.zip -d /tmp/slidetex > /dev/null

if [ ! -d "/tmp/slidetex/SlideTex" ]; then
  echo Unzipping failed.
  exit 2
fi
rm deploy.zip
echo Extracted

echo Remove temporary files
mv /tmp/slidetex/SlideTex ./SlideTex_New
rm -rf /tmp/slidetex

echo Insert new output defaults into persistence
cp -p $(find SlideTex_New/webapp/output -name '*.pdf' -o -name '*.tex') Persistence/

echo Replace old output folder with existing Persistence with symlink
rm -rf SlideTex_New/webapp/output
ln -s ../../Persistence SlideTex_New/webapp/output

service slidetex stop

echo Replace old source with new one
mv SlideTex old_instances/$TIMESTAMP
mv SlideTex_New SlideTex

service slidetex start

exit
ENDSSH

printf "${RED}Deploying on ${HOST} DONE${NC}"