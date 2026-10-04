import Link from "next/link";

const features = [
  ["Knowledge that belongs to your business", "Add FAQs, company information, website content and files so each assistant answers from your own knowledge."],
  ["A chatbot built for your website", "Customize the identity, colors and welcome experience, then place the assistant on your website."],
  ["Conversations that become insight", "Keep conversations organized and prepare your team for leads, analytics and human handoff."],
];

const plans = [
  { name: "Starter", price: "19€", description: "For a first website assistant.", features: ["1 website", "1 chatbot", "Basic customization", "1,000 messages / month"], featured: false },
  { name: "Business", price: "49€", description: "For growing companies.", features: ["Multiple knowledge sources", "Conversation history", "Usage statistics", "5,000 messages / month"], featured: true },
  { name: "Pro", price: "99€", description: "For teams that need more.", features: ["Higher usage limits", "Advanced customization", "Priority features", "20,000 messages / month"], featured: false },
];

export default function HomePage() {
  return (
    <main className="site-shell">
      <nav className="site-nav">
        <Link className="brand" href="/"><span>H</span> HELP-ME<span className="brand-dot">.</span></Link>
        <div className="nav-links"><Link href="#features">Platform</Link><Link href="#pricing">Pricing</Link><Link href="/login">Sign in</Link><Link className="nav-cta" href="/register">Start free</Link></div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <div className="eyebrow">HELP-ME BUSINESS · AI CUSTOMER ASSISTANTS</div>
          <h1>Your business, <span>always ready</span> to answer.</h1>
          <p>Create a smart website assistant trained on your company knowledge. Turn questions into conversations, leads and better customer service.</p>
          <div className="actions"><Link className="button primary" href="/register">Create your assistant</Link><Link className="button" href="#pricing">Explore plans</Link></div>
          <div className="hero-proof"><span>✓ No AI key in the browser</span><span>✓ Company data isolation</span><span>✓ Start with free Mock AI</span></div>
        </div>
        <div className="hero-visual">
          <div className="glow-orb" />
          <div className="assistant-window">
            <div className="assistant-top"><div className="assistant-logo">H</div><div><strong>HELP-ME Assistant</strong><small>Online · Your business knowledge</small></div><i /></div>
            <div className="assistant-body"><div className="bubble">Hello! 👋 How can I help you today?</div><div className="bubble visitor">I have a question about your services.</div><div className="bubble">Absolutely. I can answer using your company information.</div></div>
            <div className="assistant-input">Type your message… <b>→</b></div>
          </div>
        </div>
      </section>

      <section id="features" className="landing-section">
        <div className="section-intro"><div className="eyebrow">ONE BUSINESS · ONE KNOWLEDGE · ONE ASSISTANT</div><h2>Everything your website assistant needs.</h2></div>
        <div className="feature-grid">{features.map(([title,text],i)=><article className="feature-card" key={title}><div className="feature-number">0{i+1}</div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section id="pricing" className="landing-section pricing-section">
        <div className="section-intro center"><div className="eyebrow">SIMPLE MONTHLY PLANS</div><h2>Choose the scale that fits your business.</h2><p>Transparent limits now. Stripe billing and automated plan enforcement will be connected in the billing stage.</p></div>
        <div className="pricing-grid">{plans.map((plan)=><article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>{plan.featured && <div className="popular">MOST POPULAR</div>}<div className="plan-name">{plan.name}</div><div className="price">{plan.price}<small>/ month</small></div><p>{plan.description}</p><ul>{plan.features.map((feature)=><li key={feature}>✓ {feature}</li>)}</ul><Link className={`button ${plan.featured ? "primary" : ""}`} href="/register">Choose {plan.name}</Link></article>)}</div>
      </section>

      <section className="final-cta"><div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Give your website an assistant worth talking to.</h2></div><Link className="button primary" href="/register">Build your first chatbot</Link></section>
      <footer className="site-footer"><span>© {new Date().getFullYear()} HELP-ME Business</span><div><Link href="/privacy">Privacy</Link><Link href="/login">Sign in</Link></div></footer>
    </main>
  );
}
