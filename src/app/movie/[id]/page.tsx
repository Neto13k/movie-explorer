export default async function MovieDetailPage({ params }) {
  const { id } = await params

  return <p>ID do filme: {id}</p>
}