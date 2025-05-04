import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-[90vh] flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops, la página que buscás no existe.</p>
      <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Volver al inicio
      </Link>
    </div>
  );
}