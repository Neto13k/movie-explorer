import { MovieDetails, CastMember } from "@/app/types";

export default async function MovieDetailPage({ params }) {
  const { id } = await params;

  const [movieResponse, creditsResponse] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
    }),

    fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
    }),
  ]);

  if (!movieResponse.ok) {
    throw new Error(
      `Erro ao buscar filme: ${movieResponse.status} ${movieResponse.statusText}`
    );
  }

  if (!creditsResponse.ok) {
    throw new Error(
      `Erro ao buscar créditos: ${creditsResponse.status} ${creditsResponse.statusText}`
    );
  }

  const movie: MovieDetails = await movieResponse.json();
  const creditsData: { cast: CastMember[] } =
    await creditsResponse.json();

  const cast = creditsData.cast;

  return (
    <main>
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={`Poster de ${movie.title}`}
        />
      )}

      <h1>{movie.title}</h1>

      <div>
        {movie.genres.map((genre) => (
          <span key={genre.id}>{genre.name}</span>
        ))}
      </div>

      <p>{movie.release_date}</p>

      <p>Nota: {movie.vote_average.toFixed(1)}</p>

      <p>{movie.overview}</p>

      <h2>Elenco</h2>

      <div>
        {cast.map((member) => (
          <div key={member.id}>
            {member.profile_path && (
              <img
                src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                alt={`Foto de ${member.name}`}
              />
            )}

            <p>{member.name}</p>
            <p>{member.character}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
