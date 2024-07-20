import { MoonIcon, SunIcon } from "lucide-react";
import useDarkMode from "use-dark-mode";

export const ThemeSwitcher = () => {
  const darkMode = useDarkMode(false);

  return (
    <div className="flex justify-center p-4">
      <button
        onClick={darkMode.toggle}
        className=" text-lg font-semibold transition-colors duration-300 ease-in-out
          "
      >
        {darkMode.value ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
};
