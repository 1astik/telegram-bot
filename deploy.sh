#!/bin/sh

# Исходный каталог. По умолчанию текущий каталог.
DIR=${1:-`pwd`}
DIRPATH=$(dirname $DIR)

# Целевой сервер для ssh-соединения.
HOST=${2:-default.server.com}
APPPORT=${3:-70}
TARGETPATH=node
DIRNAME=$(basename $DIR)

# Запушить приложения на хост
# ssh root@$HOST 'cd node; rm -rf *'
cd $DIRPATH; tar czf - $DIRNAME | ssh root@$HOST '(cd $TARGETPATH; rm -rf *; tar xzf -)'

# Старт приложения
# ssh root@$HOST "cd $TARGETPATH/$DIRNAME; PORT=$APPPORT; npm run start"