'use client'

import { useState, useEffect, useRef } from "react";
import { MovieWithGenres, Genre, Movie } from '../types/index'
import SearchBar from './SearchBar'
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MovieWithGenres[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allMovies, setAllMovies] = useState<MovieWithGenres[]>(movies);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const genreId = value ? Number(value) : null;

    setSelectedGenre(genreId);
  };

  const genresMap = new Map<number, string>(
    genres.map((genre) => [genre.id, genre.name])
  );

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(null);
      return;
    }

    async function buscarFilmes() {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&language=pt-BR`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
          },
        }
      );

      const data = await response.json();

      const resultados = data.results.map((movie: Movie) => ({
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

      setSearchResults(resultados);
    }

    buscarFilmes();
  }, [searchTerm, genresMap]);

  async function carregarMaisFilmes() {
  const nextPage = currentPage + 1;

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${nextPage}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
    }
  );

  const data = await response.json();

  const novosFilmes = data.results.map((movie: Movie) => ({
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

  setAllMovies((filmesAtuais) => [...filmesAtuais, ...novosFilmes]);
  setCurrentPage(nextPage);
}
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      carregarMaisFilmes();
    }
  });

  if (observerRef.current) {
    observer.observe(observerRef.current);
  }

  return () => {
    observer.disconnect();
  };
}, [currentPage]);

  const filteredMovies = (searchResults ?? allMovies).filter((movie) =>
    selectedGenre === null ||
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

      <SearchBar onSearch={setSearchTerm} />

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 list-none">
        {filteredMovies.map((movie) => (
          <li key={movie.id} className="rounded-lg overflow-hidden border border-foreground/10 hover:border-accent transition-colors">
            <Link href={`/movie/${movie.id}`}>
  {movie.poster_path && (
    <img className="w-full aspect-[2/3] object-cover"
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
    />
  )}

  <div className="p-2">
    <h2 className="text-sm font-semibold truncate">{movie.title}</h2>

    <ul className="flex flex-wrap gap-1 mt-1 list-none">
      {movie.genres.map((genre) => (
        <li key={genre.id} className="text-xs text-foreground/60">
          {genre.name}
        </li>
      ))}
    </ul>
  </div>
</Link>
          </li>
        ))}
      </ul>
      <div ref={observerRef} style={{ height: "1px" }}></div>
    </div>
  );
}