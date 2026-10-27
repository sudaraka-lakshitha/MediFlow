(() => {
  if (window !== window.top || window.origin !== "https://mediflow-pharmacy.vercel.app") return;
  const token = "__CHANNEL_TOKEN__";
  const maxBytes = 25 * 1024 * 1024;
  const waiting = new Map();
  let port, serial = 0;
  const ready = new Promise(resolve => {
    const connected = event => {
      if (event.data !== token || !event.ports[0]) return;
      window.removeEventListener("message", connected);
      port = event.ports[0];
      port.onmessage = e => {
        let reply;
        try { reply = JSON.parse(e.data); } catch { return; }
        const request = waiting.get(reply.id);
        if (!request) return;
        clearTimeout(request.timer);
        waiting.delete(reply.id);
        reply.error ? request.reject(new Error(reply.error)) : request.resolve(reply);
      };
      port.start();
      resolve();
    };
    window.addEventListener("message", connected);
  });
  const send = async payload => {
    await ready;
    const id = String(++serial);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { waiting.delete(id); reject(new Error("The app did not respond. Please try again.")); }, 30000);
      waiting.set(id, { resolve, reject, timer });
      port.postMessage(JSON.stringify({ ...payload, id }));
    });
  };
  const report = error => {
    let notice = document.getElementById("mediflow-native-notice");
    if (!notice) {
      notice = document.createElement("div");
      notice.id = "mediflow-native-notice";
      notice.setAttribute("role", "alert");
      Object.assign(notice.style, { position:"fixed", bottom:"12px", left:"12px", right:"12px", padding:"16px", background:"#fff3dc", color:"#5b3900", border:"1px solid #c88a25", borderRadius:"10px", zIndex:"2147483647" });
      document.body.appendChild(notice);
    }
    notice.textContent = error.message || "Unable to open this document.";
    setTimeout(() => notice.remove(), 10000);
  };
  const safeUrl = value => {
    const url = new URL(value, location.href);
    if (url.protocol === "blob:" && url.origin === location.origin) return url.href;
    if (url.protocol === "https:" && !url.username && !url.password &&
        ["mediflow-pharmacy.vercel.app","mediflow-api-xnsg.onrender.com"].includes(url.hostname) &&
        (!url.port || url.port === "443")) return url.href;
    throw new Error("This file is outside MediFlow. Open its website in a separate tab instead.");
  };
  let transferring = false;
  async function documentTab(url, name) {
    if (transferring) throw new Error("Please wait for the current document to finish opening.");
    transferring = true;
    let transfer;
    try {
      const response = await fetch(safeUrl(url), { credentials:"same-origin" });
      if (!response.ok) throw new Error("The document could not be loaded. Please sign in again if your session expired.");
      const declaredSize = Number(response.headers.get("content-length"));
      if (declaredSize > maxBytes) throw new Error("Documents must be 25 MB or smaller.");
      // Stream into bounded pieces rather than converting an unbounded response.
      const reader = response.body.getReader();
      const mime = (response.headers.get("content-type") || "application/octet-stream").split(";")[0];
      let size = 0;
      try {
        const begun = await send({ type:"begin", name:name || (mime === "application/pdf" ? "MediFlow-document.pdf" : "MediFlow-document"), mime });
        transfer = begun.transfer;
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          size += value.length;
          if (size > maxBytes) throw new Error("Documents must be 25 MB or smaller.");
          for (let offset=0; offset<value.length; offset+=32768) {
            const bytes = value.subarray(offset, offset + 32768);
            let binary = "";
            for (let i=0; i<bytes.length; i++) binary += String.fromCharCode(bytes[i]);
            await send({ type:"chunk", transfer, data:btoa(binary) });
          }
        }
      } finally { await reader.cancel().catch(() => {}); }
      await send({ type:"end", transfer });
      transfer = null;
    } finally {
      if (transfer) send({ type:"abort", transfer }).catch(() => {});
      transferring = false;
    }
  }
  window.__mediflowOpenDocument = (url, name) => documentTab(url, name).catch(report);
  const printHtml = frame => {
    try {
      const html = "<!doctype html>" + frame.document.documentElement.outerHTML;
      if (html.length > 1000000) throw new Error("This print preview is too large. Download its PDF instead.");
      send({ type:"html", html, name:frame.document.title || "Print preview" }).catch(report);
    } catch (error) { report(error); }
  };
  window.print = () => printHtml(window);
  const originalOpen = window.open.bind(window);
  window.open = (url, target, features) => {
    if (!url || url === "about:blank") {
      // MediFlow's bag-label flow writes HTML into a newly opened window.
      let html = "", committed = false;
      const commit = () => {
        if (committed) return;
        committed = true;
        if (html.length > 1000000) { report(new Error("Print preview is too large.")); return; }
        send({ type:"html", html, name:"Print preview" }).catch(report);
      };
      return { document:{ write:part => { html += String(part); }, close:commit }, focus:()=>{}, print:commit, close:()=>{}, closed:false };
    }
    const resolved = new URL(url, location.href);
    if (resolved.protocol === "blob:" || /\.pdf$/i.test(resolved.pathname)) {
      window.__mediflowOpenDocument(resolved.href);
      return null;
    }
    if (resolved.protocol === "https:") {
      send({ type:"link", url:resolved.href }).catch(report);
      return null;
    }
    return originalOpen(url, target, features);
  };
  function handleAnchor(anchor) {
    if (!anchor?.href) return false;
    if (anchor.hasAttribute("download") || anchor.href.startsWith("blob:") || /\.pdf(?:[?#]|$)/i.test(anchor.href)) {
      window.__mediflowOpenDocument(anchor.href, anchor.download || undefined);
      return true;
    }
    if (anchor.target === "_blank" && anchor.href.startsWith("https:")) {
      send({type:"link",url:anchor.href}).catch(report);
      return true;
    }
    return false;
  }
  const originalClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function() {
    if (!handleAnchor(this)) originalClick.call(this);
  };
  document.addEventListener("click", event => {
    const anchor = event.target.closest?.("a");
    if (handleAnchor(anchor)) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  const inspected = new WeakMap();
  async function inspectFrame(frame) {
    const key = frame.srcdoc || frame.src;
    const previous = inspected.get(frame);
    if (previous?.key === key) return;
    if (previous?.button) {
      previous.button.remove();
      frame.style.display = previous.display;
    }
    const state = {key, display:frame.style.display};
    inspected.set(frame, state);
    const hookPrint = () => { try { frame.contentWindow.print = () => printHtml(frame.contentWindow); } catch {} };
    hookPrint();
    frame.addEventListener("load", hookPrint, {once:true});
    if (frame.srcdoc || !frame.src.startsWith("blob:")) return;
    try {
      const response = await fetch(safeUrl(frame.src));
      const pdf = response.headers.get("content-type")?.split(";")[0] === "application/pdf";
      await response.body?.cancel();
      if (!pdf || !frame.isConnected || inspected.get(frame) !== state) return;
      frame.style.display = "none";
      const button = document.createElement("button");
      state.button = button;
      button.type = "button";
      button.className = "btn btn-outline-primary w-100 my-2";
      button.textContent = "Open PDF in a document tab";
      button.addEventListener("click", () => window.__mediflowOpenDocument(frame.src, frame.title || undefined));
      frame.insertAdjacentElement("afterend", button);
    } catch { /* Normal page error handling remains available. */ }
  }
  const scan = () => document.querySelectorAll("iframe").forEach(inspectFrame);
  new MutationObserver(scan).observe(document.documentElement, {childList:true,subtree:true,attributes:true,attributeFilter:["src","srcdoc"]});
  scan();
})();
