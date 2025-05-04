import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Cargar el tema desde localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
      document.body.classList.add(savedTheme);
    } else {
      // Si no hay tema guardado, comprobar la preferencia del sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      document.body.classList.add(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    // Guardar el tema en localStorage
    if (isDarkMode) {
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      localStorage.setItem("theme", "light");
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer"
    >
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle;
