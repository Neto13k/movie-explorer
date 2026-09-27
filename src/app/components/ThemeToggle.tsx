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
  <button onClick={() => setIsDark(!isDark)}>
    {isDark ? "Modo claro" : "Modo escuro"}
  </button>
);

}

