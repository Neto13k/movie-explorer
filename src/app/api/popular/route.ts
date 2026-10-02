// src/app/api/popular/route.ts  →  responde em GET /api/popular?page=2

export async function GET(request: Request) {
  // 1. Ler o parâmetro da URL da requisição
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");

  // 2. Validar a entrada (a TMDB só aceita páginas de 1 a 500)
  if (!Number.isInteger(page) || page < 1 || page > 500) {
    return Response.json({ error: "Parâmetro 'page' inválido" }, { status: 400 });
  }

  // 3. Garantir que o token existe no servidor (erro comum: esquecer de reiniciar o dev)
  const token = process.env.TMDB_API_KEY;
  if (!token) {
    return Response.json({ error: "Servidor sem token configurado" }, { status: 500 });
  }

  // 4. Chamar a TMDB. O endereço é fixo: só a página vem do usuário
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${page}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    return Response.json({ error: "Falha ao buscar filmes" }, { status: 502 });
  }

  // 5. Devolver o mesmo JSON da TMDB
  const data = await response.json();
  return Response.json(data);
}