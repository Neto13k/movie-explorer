export interface Genre {
  id: number;
  name: string;
};

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids: number[];
};

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  genres: {
    id: number;
    name: string;
  }[];
}

