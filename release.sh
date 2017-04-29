#!/bin/bash
cd edunav/
ioniczipalign build android --release

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../../edunav.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk edunav
~/Library/Android/sdk/build-tools/25.0.2/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk ../EduNav.apk