#!/bin/sh
# Deploys a working SlideTex.zip file which have to be a working instance folder

HOST='slidetex.net'
USER='root'
SERVER_DIR='/var/www/slidetex.net'

SEP_PRE='\033[0;32m --------------------------------\n'
SEP_PRE_ERROR='\033[0;31m --------------------------------\n'
SEP_POST='\n --------------------------------\033[0m\n' # No Color
printf "${SEP_PRE}Create a build for deploying${SEP_POST}"

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


printf "${SEP_PRE}Deploying on ${HOST} STARTING${SEP_POST}"

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
cp -r SlideTex_New/webapp/output/* Persistence/

echo Replace old output folder with existing Persistence with symlink
rm -rf SlideTex_New/webapp/output
ln -s ../../Persistence SlideTex_New/webapp/output

service slidetex stop

echo Replace old source with new one
mv SlideTex old_instances/$TIMESTAMP
mv SlideTex_New SlideTex
chown -R wittem:wittem SlideTex

service slidetex start

exit
ENDSSH


printf "Testing system state.."
sleep 1
printf "."
sleep 1
printf ".\n"

RESPONSE=$(curl --write-out %{http_code} --silent --output /dev/null $HOST)

if [ "$RESPONSE" = "200" ]
  then
    printf "${SEP_PRE}Deploying on ${HOST} SUCCESSFUL DONE: $RESPONSE${SEP_POST}"
  else
    printf "${SEP_PRE_ERROR}Deploying on ${HOST} FAILED: $RESPONSE${SEP_POST}"
    exit 1
fi
