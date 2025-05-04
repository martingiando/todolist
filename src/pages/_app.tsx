import ThemeToggle from '@/components/theme/ThemeToggle';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
   <div className="min-h-screen bg-gray-100 text-black p-4">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </div>
  );
}
