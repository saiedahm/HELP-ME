"use client";

import { useEffect, useState } from "react";

export type SiteLanguage = "en" | "de" | "ar";

export default function LanguageSwitcher({ value, onChange }: { value: SiteLanguage; onChange: (language: SiteLanguage) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="language-switcher" aria-hidden="true">EN</div>;
  return <label className="language-switcher" title="Language">
    <span>◎</span>
    <select value={value} onChange={(event) => onChange(event.target.value as SiteLanguage)} aria-label="Language">
      <option value="en">EN</option>
      <option value="de">DE</option>
      <option value="ar">AR</option>
    </select>
  </label>;
}
