package com.mediflow.pharmacy;

import java.net.URI;

/** No substring host checks, HTTP downgrade, user-info URLs, or file URLs. */
final class SitePolicy {
    static final String ORIGIN = "https://mediflow-pharmacy.vercel.app";
    static final String HOME = ORIGIN + "/";
    static final long MAX_DOCUMENT_BYTES = 25L * 1024 * 1024;
    static boolean https(String value) {
        try {
            URI uri = new URI(value);
            return "https".equalsIgnoreCase(uri.getScheme()) && uri.getHost() != null
                && uri.getUserInfo() == null;
        } catch (Exception ignored) { return false; }
    }
    static boolean trusted(String value) {
        try {
            URI uri = new URI(value);
            return https(value) && "mediflow-pharmacy.vercel.app".equalsIgnoreCase(uri.getHost())
                && (uri.getPort() == -1 || uri.getPort() == 443);
        } catch (Exception ignored) { return false; }
    }
    static boolean downloadable(String value) {
        try {
            URI uri = new URI(value);
            return trusted(value) || (https(value)
                && "mediflow-api-xnsg.onrender.com".equalsIgnoreCase(uri.getHost())
                && (uri.getPort() == -1 || uri.getPort() == 443));
        } catch (Exception ignored) { return false; }
    }
    static String filename(String name) {
        String safe = (name == null ? "" : name).replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "_").trim();
        while (safe.startsWith(".")) safe = safe.substring(1);
        if (safe.isEmpty()) safe = "MediFlow-document";
        return safe.length() > 110 ? safe.substring(safe.length() - 110) : safe;
    }
    private SitePolicy() {}
}
