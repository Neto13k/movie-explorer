import { Genre, Movie } from "../app/types/index";
import FilterFilms from "./components/FilterFilms";

export const metadata = {
  title: "Filmes Populares | Movie Explorer",
  description: "Veja os filmes mais populares do momento, com busca por título, filtro por gênero e rolagem infinita.",
};

export default async function Page() {
  // Busca filmes e gêneros em paralelo para carregar mais rápido
  const [moviesResponse, genresResponse] = await Promise.all([
    fetch("https://api.themoviedb.org/3/movie/popular?language=pt-BR", {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    }),

    fetch("https://api.themoviedb.org/3/genre/movie/list?language=pt-BR", {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    }),
  ]);

  if (!moviesResponse.ok) {
    // Next.js captura esse throw e renderiza o error.tsx
    throw new Error(
      `Erro ao buscar filmes: ${moviesResponse.status} ${moviesResponse.statusText}`
    );
  }

  if (!genresResponse.ok) {
    throw new Error(
      `Erro ao buscar gêneros: ${genresResponse.status} ${genresResponse.statusText}`
    );
  }

  const moviesData = await moviesResponse.json();
  const genresData = await genresResponse.json();

  // Mapa id → nome para resolver os gêneros dos filmes rapidamente
  const genresMap = new Map<number, string>(
    genresData.genres.map((genre: Genre) => [genre.id, genre.name])
  );

  const movies = moviesData.results.map((movie: Movie) => ({
    ...movie,
    // Troca os ids dos gêneros por objetos {id, name} que o componente usa
    genres: movie.genre_ids
      .map((genreId) => {
        const name = genresMap.get(genreId);

        if (!name) {
          return null; // Gênero não existe mais na lista (raro, mas protege contra dado inconsistente)
        }

        return {
          id: genreId,
          name,
        };
      })
      // Type guard: remove os nulls de cima e informa o TypeScript que o array é só de gêneros válidos
      .filter(
        (genre): genre is { id: number; name: string } => genre !== null
      ),
  }));

  return (
    <main>
      <FilterFilms movies={movies} genres={genresData.genres} />
    </main>
  );
}