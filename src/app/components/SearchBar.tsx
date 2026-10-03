'use client'
import React, { useState, useEffect } from 'react'

export default function SearchBar({ onSearch }: { onSearch: (termo: string) => void }) {
// Estado local controlado: só sobe pro pai depois do debounce
const [valorDigitado, setValorDigitado] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValorDigitado(e.target.value);
  };

  useEffect(() => {
    // Debounce: espera o usuário parar de digitar antes de buscar
    const timer = setTimeout(() => {
      onSearch(valorDigitado);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [valorDigitado, onSearch]);

  return (
  <div className="flex items-center gap-2">
    <label htmlFor="busca" className="text-sm text-foreground/70">
      Buscar:
    </label>
    <input
      id="busca"
      type="text"
      value={valorDigitado}
      onChange={handleChange}
      placeholder="Digite para buscar..."
      className="bg-background border border-foreground/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
    />
  </div>
);
}