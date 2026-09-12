'use client'

import { useState } from "react";
import { MovieWithGenres, Genre } from '../types/index'
import Link from "next/link"

type FilterFilmsProps = {
  movies: MovieWithGenres[];
  genres: Genre[];
};

export default function FilterFilms({
  movies,
  genres,
}: FilterFilmsProps) {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const genreId = value ? Number(value) : null;

    setSelectedGenre(genreId);
  };

  const filteredMovies =
    selectedGenre === null
      ? movies
      : movies.filter((movie) =>
          movie.genres.some((genre) => genre.id === selectedGenre)
        );

  return (
    <div>
      <select value={selectedGenre ?? ""} onChange={handleChange}>
        <option value="">Todos os gêneros</option>

        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <ul>
        {filteredMovies.map((movie) => (
          <li key={movie.id}>
            <Link href={`/movie/${movie.id}`}>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              )}

              <h2>{movie.title}</h2>

              <ul>
                {movie.genres.map((genre) => (
                  <li key={genre.id}>{genre.name}</li>
                ))}
              </ul>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}