#!/bin/bash
set -e
cd /opt/apps/spring-sample
export $(grep -v '^#' .env | xargs)
nohup java -jar spring-sample-0.0.1-SNAPSHOT.jar --spring.config.additional-location=application.yml > app.log 2>&1 &
echo $! > app.pid
