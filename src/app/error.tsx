'use client'; 

import { useEffect } from 'react'


export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }){
    useEffect(() => {
    console.error(error)
  }, [error])    
    
    return(
        <div>       
        <p> Erro ao carregar pagina, Por favor Tente novamente</p>
        <button onClick={() => reset()}> Recarregar pagina</button>
        </div>
    )
}