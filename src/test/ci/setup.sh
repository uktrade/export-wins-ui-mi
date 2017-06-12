#!/bin/bash

if [ -d ./output/screenshots ]; then
	rm -r ./output/screenshots;
fi

mkdir -p ./output/screenshots;

if [ -d ./output/accessibility-reports ]; then
	rm -r ./output/accessibility-reports;
fi

mkdir -p ./output/accessibility-reports;
