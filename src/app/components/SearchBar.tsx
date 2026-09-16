'use client'
import React, { useState, useEffect } from 'react'

export default function SearchBar({ onSearch }: { onSearch: (termo: string) => void }) {
const [valorDigitado, setValorDigitado] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValorDigitado(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(valorDigitado);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [valorDigitado, onSearch]);

  return (
    <div>
      <label htmlFor="busca">Buscar:</label>
      <input
        id="busca"
        type="text"
        value={valorDigitado}
        onChange={handleChange}
        placeholder="Digite para buscar..."
      />
    </div>
    
  )
}