// Gênero simplificado: a TMDB devolve só id + nome
export interface Genre {
  id: number;
  name: string;
};

// Filme como vem da listas (populares, busca) — os gêneros são só ids
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null; // null = sem poster
  genre_ids: number[];
};

// Pessoa do elenco (ator/atriz)
export interface CastMember {
  id: number;
  name: string;
  character: string; // Nome do personagem interpretado
  profile_path: string | null;
};

// Detalhes completos do filme (página individual) — gêneros já vêm como objetos
export interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string; // Sinopse
  vote_average: number;
  release_date: string;
  genres: {
    id: number;
    name: string;
  }[];
}

// Versão de Movie com genre_ids trocados por objetos Genre (usado no client component)
export interface MovieWithGenres extends Omit<Movie, "genre_ids"> {
  genres: Genre[];
}