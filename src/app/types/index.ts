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