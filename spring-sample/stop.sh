#!/bin/bash
set -e
if [ -f app.pid ]; then
  PID=$(cat app.pid)
  kill $PID || true
  rm -f app.pid
  echo "stopped $PID"
else
  echo "no pid file"
fi
