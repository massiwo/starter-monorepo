#!/bin/bash
pwd=$(dirname "$0")

./stop.sh $1
./start.sh $1