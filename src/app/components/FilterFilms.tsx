'use client'

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MovieWithGenres, Genre, Movie } from '../types/index'
import SearchBar from './SearchBar'
import Link from "next/link"

type FilterFilmsProps = {
  movies: MovieWithGenres[];
  genres: Genre[];
};

const subscribe = () => () => {};

export default function FilterFilms({
  movies,
  genres,
}: FilterFilmsProps) {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null); // null = todos os gêneros
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MovieWithGenres[] | null>(null); // null = sem busca, usa a lista de populares
  const [currentPage, setCurrentPage] = useState(1); // Página atual para paginação da TMDB
  const [allMovies, setAllMovies] = useState<MovieWithGenres[]>(movies); // Acumula as páginas carregadas (rolagem infinita)
  const observerRef = useRef<HTMLDivElement | null>(null);

  const portalTarget = useSyncExternalStore(
    subscribe,
    () => document.getElementById("header-search-portal"),
    () => null,
  ); // SSR-safe: evita acessar document diretamente no render inicial

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const genreId = value ? Number(value) : null; // "" do option padrão vira null (todos os gêneros)

    setSelectedGenre(genreId);
  };

  // Mesmo propósito do genresMap do server component — prepara busca e carregamento de páginas novas
  const genresMap = new Map<number, string>(
    genres.map((genre) => [genre.id, genre.name])
  );

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(null); // Limpa a busca: volta a exibir a lista de populares
      return;
    }

    async function buscarFilmes() {
      // Agora chama a rota do próprio site; o token fica só no servidor
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        return;
      }

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
    const nextPage = currentPage + 1; // Busca a próxima página de populares

    // Usa a rota do app router em vez de chamar a TMDB direto do cliente
    const response = await fetch(`/api/popular?page=${nextPage}`);

    if (!response.ok) {
      return; // Silencia erro: usuário pode só continuar vendo o que já carregou
    }

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

    setAllMovies((filmesAtuais) => {
      // Evita filmes duplicados entre páginas diferentes
      const filmesSemDuplicata = novosFilmes.filter((filme: MovieWithGenres) =>
        !filmesAtuais.some((filmeExistente) => filmeExistente.id === filme.id)
      );

      return [...filmesAtuais, ...filmesSemDuplicata];
    });
    setCurrentPage(nextPage);
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        carregarMaisFilmes(); // Carrega quando o usuário chega no fim da lista
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [currentPage]);

  // Mostra resultados da busca ou da lista de populares + filtra por gênero
  const filteredMovies = (searchResults ?? allMovies).filter((movie) =>
    selectedGenre === null ||
    movie.genres.some((genre) => genre.id === selectedGenre)
  );

  // Barra de gêneros + busca: só o layout interno. Sticky, borda e fundo são do Header.
  const barra = (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={selectedGenre ?? ""}
        onChange={handleChange}
        className="bg-background border border-foreground/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
      >
        <option value="">Todos os gêneros</option>

        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <SearchBar onSearch={setSearchTerm} />
    </div>
  );

  return (
    <div>
      {/* Desenha a barra dentro do Header (só existe enquanto o FilterFilms está na tela) */}
      {portalTarget && createPortal(barra, portalTarget)}

      <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 list-none">
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