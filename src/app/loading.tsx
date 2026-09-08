export default function Loading() {
  const quantidadeDeBlocos = 6;

  return (
    <div>
      {Array.from({ length: quantidadeDeBlocos }).map((_, index) => (
        <div key={index}>
          <div>{/*imagem*/}</div>
          <div>{/*título*/}</div>
          <div>{/*genero*/}</div>
        </div>
      ))}
    </div>
  );
}