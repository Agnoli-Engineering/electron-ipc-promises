#!/bin/sh -euf

./node_modules/.bin/electron-rebuild
./node_modules/.bin/webpack --config ./webpack.config.js
cp ./test/index.html ./dist/test/index.html
./node_modules/.bin/electron ./dist/test/main.js
