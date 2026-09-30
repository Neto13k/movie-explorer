"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-2">
      <p className="text-foreground/70">
        Erro ao carregar página. Por favor, tente novamente.
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 rounded-md bg-accent text-background font-medium hover:opacity-90 transition-opacity"
      >
        Recarregar página
      </button>
    </div>
  );
}
