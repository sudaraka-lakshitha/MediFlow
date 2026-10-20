# MediFlow Android launcher

Small, signed APK opening `https://mediflow-pharmacy.vercel.app/` with Android
Custom Tabs. Android 6+ and an installed modern browser are required. Browser UI
is intentionally retained: this is a website launcher, not a native rewrite or
an offline clinical application. No credentials or Android permissions are
embedded. The browser handles file selection, downloads, printing and sessions.

The website's service worker caches only versioned public interface files.
First use needs a connection; patient information and backend operations remain
online. New UI versions activate once the old site's tabs are closed. No APK
update is required for normal website releases.

Build using JDK 21, Android platform 36 and build tools 36:

```powershell
./build.ps1 -BuildTools 'path/to/build-tools/36.0.0' -AndroidJar 'path/to/platforms/android-36/android.jar' -JavaBin 'path/to/jdk/bin'
```

Output: `build/MediFlow.apk`. Signature and ZIP alignment are checked by the
script. Back up the ignored `signing/` folder securely: future APK updates must
use the same key and a higher manifest versionCode. Never commit or distribute
the private key/password. The launcher has not yet been tested on a physical
Android phone.
