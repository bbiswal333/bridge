#!/bin/bash

BASE_DIR=`dirname $0`

grunt check-style | sed -n "/<\?.*\<\/checkstyle\>/p"