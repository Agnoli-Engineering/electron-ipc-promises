#!/bin/sh

rm -rf dist

mkdir dist

./node_modules/.bin/babel src --out-dir dist --presets @babel/preset-env
