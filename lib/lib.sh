
_batjar=/Users/yikuair/html/limeiFw/adlist/bat/jar


#compress
java -jar $_batjar/yuicompressor-2.4.7.jar --type js --charset utf-8 -v ./lib.js > ./lib.min.js
