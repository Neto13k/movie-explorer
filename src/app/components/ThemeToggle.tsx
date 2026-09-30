'use client'

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [isDark]);

return (
  <button
    onClick={() => setIsDark(!isDark)}
    className="fixed top-4 right-4 z-20 bg-foreground/10 hover:bg-accent hover:text-background rounded-full px-3 py-1.5 text-sm transition-colors"
  >
    {isDark ? "☀️ Modo claro" : "🌙 Modo escuro"}
  </button>
);
}

