import { Genre, Movie } from "../app/types/index";
import FilterFilms from "./components/FilterFilms";

export default async function Page() {
  const [moviesResponse, genresResponse] = await Promise.all([
    fetch("https://api.themoviedb.org/3/movie/popular", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
    }),

    fetch("https://api.themoviedb.org/3/genre/movie/list", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
    }),
  ]);

  if (!moviesResponse.ok) {
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

  const genresMap = new Map<number, string>(
    genresData.genres.map((genre: Genre) => [genre.id, genre.name])
  );

  const movies = moviesData.results.map((movie: Movie) => ({
    ...movie,
    genres: movie.genre_ids
      .map((genreId) => {
        const name = genresMap.get(genreId);

        if (!name) {
          return null;
        }

        return {
          id: genreId,
          name,
        };
      })
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