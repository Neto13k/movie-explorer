import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 grid grid-cols-2 items-center gap-x-3 gap-y-2 border-b border-foreground/10 bg-background/80 px-3 py-2 backdrop-blur lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-4">
      <div
        id="header-search-portal"
        className="order-3 col-span-2 empty:hidden lg:order-none lg:col-span-1 lg:col-start-1 lg:row-start-1"
      />

      <Link
        href="/"
        className="order-1 justify-self-start lg:order-none lg:col-start-2 lg:row-start-1 lg:justify-self-center"
      >
        <Image
          src={logo}
          alt="Movie Explorer"
          width={240}
          height={44}
          className="block h-auto w-36 md:w-44 lg:w-48"
        />
      </Link>

      <div className="order-2 justify-self-end lg:order-none lg:col-start-3 lg:row-start-1">
        <ThemeToggle />
      </div>
    </header>
  );
}