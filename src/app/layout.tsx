import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";

// Variáveis CSS para as fontes do Google Fonts (via next/font)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata padrão da home — páginas internas podem sobrescrever com generateMetadata
export const metadata: Metadata = {
  title: "Movie Explorer",
  description: "Explore filmes populares, busque por título e descubra detalhes de elenco e avaliação, usando dados da TMDB.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* flex-col faz o footer (se existir) colar no fim da página com mt-auto no children */}
      <body className="min-h-full flex flex-col"> <Header /> {children}</body>
    </html>
  );
}
