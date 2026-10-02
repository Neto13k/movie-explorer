// src/app/api/search/route.ts  →  responde em GET /api/search?q=matrix

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  // Validar: termo vazio ou absurdamente grande não vai para a TMDB
  if (q === "" || q.length > 100) {
    return Response.json({ error: "Parâmetro 'q' inválido" }, { status: 400 });
  }

  const token = process.env.TMDB_API_KEY;
  if (!token) {
    return Response.json({ error: "Servidor sem token configurado" }, { status: 500 });
  }

  // encodeURIComponent: "tom & jerry" não pode quebrar a URL da TMDB
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&language=pt-BR`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    return Response.json({ error: "Falha na busca" }, { status: 502 });
  }

  const data = await response.json();
  return Response.json(data);
}