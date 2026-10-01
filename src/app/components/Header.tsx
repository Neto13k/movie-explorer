import Link from "next/link";
import Image from 'next/image'
import logo from "../assets/logo.png"
import ThemeToggle from "./ThemeToggle";


export default function Header(){
    return (
        <header> 
        <ThemeToggle /> 
        <Link href="/"><Image src={logo} alt="Movie Explorer" width={240} height={44} className="w-44 h-auto md:w-60"/></Link>
        </header>
    )}