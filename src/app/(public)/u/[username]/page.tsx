import { notFound } from "next/navigation";

type PageProps = {
  params: { username: string };
};

export default function UserPublicPage({ params }: PageProps) {
  const { username } = params;
  const user = { username };

  if (!user) return notFound();

  return (
    <main className="px-6 py-12">
      <h1 className="text-3xl font-bold">@{username}</h1>
      <p>Perfil público del usuario.</p>
    </main>
  );
}
