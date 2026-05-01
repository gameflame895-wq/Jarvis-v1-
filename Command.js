cordova create JarvisApp
cd JarvisApp
cordova platform add android
# Copy HTML above to www/index.html
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-flashlight
cordova build android
