import { MovieDetails, CastMember } from "@/app/types";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Falha ao buscar os dados");
  }

  const movie: MovieDetails = await response.json();

  return {
    title: `${movie.title} | Movie Explorer`,
    description: movie.overview,
  };
}

export default async function MovieDetailPage({ params }) {
  const { id } = await params;

  const [movieResponse, creditsResponse] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=pt-BR`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
    }),

    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=pt-BR`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
    }),
  ]);

  if (!movieResponse.ok) {
    throw new Error(
      `Erro ao buscar filme: ${movieResponse.status} ${movieResponse.statusText}`,
    );
  }

  if (!creditsResponse.ok) {
    throw new Error(
      `Erro ao buscar créditos: ${creditsResponse.status} ${creditsResponse.statusText}`,
    );
  }

  const movie: MovieDetails = await movieResponse.json();
  const creditsData: { cast: CastMember[] } = await creditsResponse.json();

  const cast = creditsData.cast;

  return (
    <main className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`Poster de ${movie.title}`}
            />
          )}
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{movie.title}</h1>

          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="text-xs bg-foreground/10 rounded-full px-2 py-1"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className="text-sm text-foreground/70">{movie.release_date}</p>
          <p className="text-accent font-semibold">
            Nota: {movie.vote_average.toFixed(1)}
          </p>
          <p className="text-sm leading-relaxed">{movie.overview}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3">Elenco</h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {cast.map((member) => (
          <div key={member.id} className="flex-shrink-0 w-28">
            {member.profile_path && (
              <img
                src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                alt={`Foto de ${member.name}`}
                className="w-full aspect-[2/3] object-cover rounded-md"
              />
            )}
            <p className="text-sm font-medium mt-1 truncate">{member.name}</p>
            <p className="text-xs text-foreground/60 truncate">
              {member.character}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
