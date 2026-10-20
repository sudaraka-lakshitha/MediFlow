package com.mediflow.pharmacy;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Bundle;
import java.util.List;

/**
 * Minimal Custom Tabs launcher. The trusted browser handles HTTPS, credentials,
 * uploads, downloads, printing, and the site's public-UI service-worker cache.
 * No WebView bridge, credentials, analytics, or sensitive Android permissions.
 */
public final class MainActivity extends Activity {
    private static final Uri SITE = Uri.parse("https://mediflow-pharmacy.vercel.app/");
    private static final String CUSTOM_TABS_SERVICE = "android.support.customtabs.action.CustomTabsService";

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        openSite();
    }

    private String browserPackage() {
        PackageManager manager = getPackageManager();
        Intent view = new Intent(Intent.ACTION_VIEW, SITE).addCategory(Intent.CATEGORY_BROWSABLE);
        ResolveInfo preferred = manager.resolveActivity(view, PackageManager.MATCH_DEFAULT_ONLY);
        List<ResolveInfo> services = manager.queryIntentServices(new Intent(CUSTOM_TABS_SERVICE), 0);
        if (preferred != null && preferred.activityInfo != null) {
            for (ResolveInfo service : services) {
                if (service.serviceInfo != null &&
                    service.serviceInfo.packageName.equals(preferred.activityInfo.packageName)) {
                    return preferred.activityInfo.packageName;
                }
            }
        }
        for (ResolveInfo service : services) {
            if (service.serviceInfo != null) return service.serviceInfo.packageName;
        }
        return null;
    }

    private void openSite() {
        Intent view = new Intent(Intent.ACTION_VIEW, SITE);
        view.addCategory(Intent.CATEGORY_BROWSABLE);
        String browser = browserPackage();
        if (browser != null) {
            view.setPackage(browser);
            // Public Custom Tabs protocol; null session avoids an extra service
            // bind/startup delay while keeping browser-backed rendering.
            Bundle extras = new Bundle();
            extras.putBinder("android.support.customtabs.extra.SESSION", null);
            extras.putInt("android.support.customtabs.extra.TOOLBAR_COLOR", 0xFF123244);
            extras.putInt("android.support.customtabs.extra.TITLE_VISIBILITY", 1);
            extras.putBoolean("android.support.customtabs.extra.ENABLE_URLBAR_HIDING", true);
            view.putExtras(extras);
        }
        try {
            startActivity(view);
            finish();
        } catch (ActivityNotFoundException | SecurityException error) {
            // A disabled/uninstalled Custom Tabs provider may disappear between
            // discovery and launch. Retry normal HTTPS handling without pinning.
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, SITE).addCategory(Intent.CATEGORY_BROWSABLE));
                finish();
            } catch (ActivityNotFoundException | SecurityException unavailable) {
                new AlertDialog.Builder(this)
                    .setTitle("A browser is needed")
                    .setMessage("Install or enable an up-to-date Android browser, then open MediFlow again.")
                    .setPositiveButton("Try again", (dialog, which) -> openSite())
                    .setNegativeButton("Close", (dialog, which) -> finish())
                    .setOnCancelListener(dialog -> finish())
                    .show();
            }
        }
    }
}
