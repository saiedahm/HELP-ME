export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key) return new Response("Missing chatbot key.", { status: 400 });
  const origin = url.origin;
  const script = "(function(){var key=" + JSON.stringify(key) + ";if(window.__HELP_ME_WIDGET__)return;window.__HELP_ME_WIDGET__=true;var iframe=document.createElement('iframe');iframe.src=" + JSON.stringify(origin) + "+'/widget/'+encodeURIComponent(key);iframe.title='HELP-ME Business Assistant';Object.assign(iframe.style,{position:'fixed',right:'20px',bottom:'20px',width:'380px',height:'600px',maxWidth:'calc(100vw - 24px)',maxHeight:'calc(100vh - 24px)',border:'0',zIndex:'2147483647',borderRadius:'18px',boxShadow:'0 24px 80px rgba(0,0,0,.35)',background:'transparent'});document.body.appendChild(iframe);})();";
  return new Response(script, { headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
