# MediFlow Android app

Version 2 opens https://mediflow-pharmacy.vercel.app/ in an app-owned WebView,
without a browser address bar. Native navigation includes a switcher for up to
six tabs. PDFs open in private document tabs with page and zoom controls; the
App actions menu provides saving and Android printing. HTML print previews and
downloaded exports are supported too. Documents are limited to 25 MB.

Use **App actions (⋮) → Website view** to choose Mobile (default) or Desktop.
The preference is remembered across launches and applies to all MediFlow web
tabs, including newly opened tabs. Desktop uses a 1280-pixel layout with pinch
zoom. Switching does not reload the page or discard form entries. External
websites, PDF tabs and print previews keep their own layout.

Requires Android 6 or newer and an updated Android System WebView. The website
remains the main interface, not a native rewrite. UI assets can be cached by the
website's service worker; clinical records and payment operations require an
internet connection. First launch requires signing in again because the former
browser launcher and this WebView do not share browser sessions.

Temporary documents are kept in private app cache, removed when closed or when
the main screen returns to login, and cleared on a fresh app launch. Explicitly
saved copies remain wherever the user chooses. Only Internet permission is
requested; Android's file picker handles uploads and saves. No credentials are
embedded. The native message channel is restricted to the MediFlow website;
external pages cannot invoke it.

Build using JDK 21, Android platform 36 and build tools 36:

```powershell
./build.ps1 -BuildTools 'path/to/build-tools/36.0.0' -AndroidJar 'path/to/platforms/android-36/android.jar' -JavaBin 'path/to/jdk/bin'
```

Output: `build/MediFlow.apk`. The script verifies signature and ZIP alignment.
Back up the ignored `signing/` folder securely: updates require the same key and
a higher versionCode. Never distribute the private key or password.

Web view mode browser test: `node android/tests/view-mode.test.cjs` (requires
Playwright; set `PLAYWRIGHT_MODULE` to its installed module path if it is not
available from the project). This covers the responsive desktop/mobile view
switch; it is not a physical-device test.
Native device tests remain necessary: no physical Android device or emulator
was available during this build. In particular verify sign-in, uploads, PDF
viewing, printing, rotation, keyboard layout and background/resume on a phone.
