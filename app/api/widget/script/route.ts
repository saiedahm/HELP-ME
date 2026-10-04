import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bot = url.searchParams.get("bot")?.trim();

  if (!bot) {
    return new NextResponse("/* HELP-ME: missing bot */", {
      status: 400,
      headers: { "Content-Type": "application/javascript; charset=utf-8" },
    });
  }

  const origin = url.origin;
  const botJson = JSON.stringify(bot);
  const originJson = JSON.stringify(origin);

  const script = `(function () {
  "use strict";
  var current = document.currentScript;
  if (!current) return;
  var bot = ${botJson};
  var origin = ${originJson};

  function add() {
    if (document.getElementById("help-me-widget-" + bot)) return;

    var button = document.createElement("button");
    var frame = document.createElement("iframe");

    button.id = "help-me-widget-button-" + bot;
    button.type = "button";
    button.setAttribute("aria-label", "Open chat assistant");
    button.textContent = "Chat";
    button.style.cssText = "position:fixed;right:20px;bottom:20px;z-index:2147483646;border:0;border-radius:999px;padding:13px 18px;background:#39d9ff;color:#031018;font:700 14px system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25);cursor:pointer;";

    frame.id = "help-me-widget-" + bot;
    frame.title = "HELP-ME chat assistant";
    frame.src = origin + "/widget/" + encodeURIComponent(bot);
    frame.setAttribute("allow", "clipboard-write");
    frame.style.cssText = "display:none;position:fixed;right:20px;bottom:76px;z-index:2147483645;width:min(390px,calc(100vw - 32px));height:min(680px,calc(100vh - 110px));border:0;border-radius:18px;background:transparent;box-shadow:0 20px 60px rgba(0,0,0,.35);";

    button.addEventListener("click", function () {
      var open = frame.style.display === "block";
      frame.style.display = open ? "none" : "block";
      button.textContent = open ? "Chat" : "Close";
    });

    document.body.appendChild(frame);
    document.body.appendChild(button);
  }

  if (document.body) add();
  else document.addEventListener("DOMContentLoaded", add, { once: true });
})();`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=300",
    },
  });
}
