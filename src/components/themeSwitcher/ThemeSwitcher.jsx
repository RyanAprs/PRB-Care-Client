import  { useEffect } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import useDarkMode from 'use-dark-mode';

export const ThemeSwitcher = () => {
  const darkMode = useDarkMode(false);

  useEffect(() => {
    const themeLink = document.getElementById("theme-link");

    if (themeLink) {
      const themeUrl = darkMode.value
        ? new URL(
            "primereact/resources/themes/arya-green/theme.css",
            import.meta.url
          ).href
        : new URL(
            "primereact/resources/themes/saga-green/theme.css",
            import.meta.url
          ).href;

      themeLink.href = themeUrl;
    }
  }, [darkMode.value]);

    return (
        <div className="flex justify-center p-4">
            <button
                onClick={darkMode.toggle}
                className="text-lg font-semibold transition-colors duration-300 ease-in-out"
            >
                {darkMode.value ? <SunIcon /> : <MoonIcon />}
            </button>
        </div>
    );
};
