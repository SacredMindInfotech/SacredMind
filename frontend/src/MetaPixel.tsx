import { useEffect } from "react";

const MetaPixel = () => {
  useEffect(() => {
    // Facebook Pixel Script
    (function (f, b, e, v, n, t, s) {
      //@ts-ignore
      if (f.fbq) return;
      //@ts-ignore
      n = f.fbq = function () {
        //@ts-ignore
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      //@ts-ignore
      if (!f._fbq) f._fbq = n;
      //@ts-ignore
      n.push = n;
      //@ts-ignore
      n.loaded = !0;
      //@ts-ignore
      n.version = "2.0";
      //@ts-ignore
      n.queue = [];
      //@ts-ignore
      t = b.createElement(e);
      //@ts-ignore
      t.async = !0;
      //@ts-ignore
      t.src = v;
      //@ts-ignore
      s = b.getElementsByTagName(e)[0];
      //@ts-ignore
      s.parentNode?.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    //@ts-ignore
    window.fbq("init", "1349565019687622");
    //@ts-ignore
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
