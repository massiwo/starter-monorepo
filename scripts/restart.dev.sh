#!/bin/bash
pwd=$(dirname "$0")

./stop.dev.sh $1
./start.dev.sh $1