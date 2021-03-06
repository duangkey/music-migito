(function (doc, win) {
  var docEl = doc.documentElement, resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
  recalc = function () {
    var clientWidth = win.innerWidth;
    if (!clientWidth) return;
    if (clientWidth > 1920) {
      clientWidth = 1920;
    }
    if (clientWidth > 1120) {
      docEl.style.fontSize = "100px";
    }
    else if (clientWidth > 1024 && clientWidth <= 1120) {
      docEl.style.fontSize = 100 * (clientWidth / 1200) + "px";
    }
    else if (clientWidth <= 1024 && clientWidth >= 768) {
      docEl.style.fontSize = 100 * (clientWidth / 1536) + "px"
    }
    else if (clientWidth < 768) {
      docEl.style.fontSize = 100 * (clientWidth / 750) + "px"
    }
  }
  if (!doc.addEventListener) return;
  recalc();
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);
