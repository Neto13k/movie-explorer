'use client'

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false); // Começa no claro — sem persistência, sempre reinicia no reload

  useEffect(() => {
  // Aplica/remove a classe na tag html para as variáveis CSS do tema funcionarem
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [isDark]);

return (
  <button
    onClick={() => setIsDark(!isDark)}
    className="bg-foreground/10 hover:bg-accent hover:text-background rounded-full px-3 py-1.5 text-sm transition-colors"
  >
    {isDark ? "☀️ Modo claro" : "🌙 Modo escuro"}
  </button>
);
}

