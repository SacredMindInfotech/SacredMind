import { useEffect } from "react";

const MetaPixel = () => {
  useEffect(() => {
    // Facebook Pixel Script
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", "1349565019687622");
    window.fbq("track", "PageView");

    // Inject noscript pixel tracking image dynamically
    const noscript = document.createElement("noscript");
    noscript.innerHTML = `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=1349565019687622&ev=PageView&noscript=1" 
      alt="Facebook Pixel" />`;
    
    document.body.appendChild(noscript);
  }, []);

  return null; // This component only runs effects, no UI needed
};

export default MetaPixel;
