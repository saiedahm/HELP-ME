"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewChatbotPage() {
  const router = useRouter();
  const [name,setName]=useState(""); const [welcomeMessage,setWelcomeMessage]=useState("Hello! How can I help you today?"); const [primaryColor,setPrimaryColor]=useState("#39d9ff"); const [error,setError]=useState(""); const [saving,setSaving]=useState(false);
  async function submit(e:React.FormEvent){e.preventDefault();setSaving(true);setError("");const r=await fetch("/api/chatbots",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,welcomeMessage,primaryColor})});const d=await r.json();if(!r.ok){setError(d.error||"Unable to create chatbot.");setSaving(false);return}router.push("/dashboard/chatbots");router.refresh();}
  return <main className="dashboard-page"><header className="dashboard-header"><div><div className="badge">HELP-ME · New Chatbot</div><h1>Create your assistant</h1><p>Define the basic identity visitors will see on your website.</p></div><Link className="button" href="/dashboard/chatbots">Back</Link></header><form className="form-card" onSubmit={submit}><label>Assistant name<input required maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="My Business Assistant"/></label><label>Welcome message<textarea maxLength={500} rows={4} value={welcomeMessage} onChange={e=>setWelcomeMessage(e.target.value)}/></label><label>Primary color<div className="color-field"><input type="color" value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)}/><code>{primaryColor}</code></div></label>{error&&<p className="form-error">{error}</p>}<button className="button primary" disabled={saving}>{saving?"Creating…":"Create assistant"}</button></form></main>;
}
