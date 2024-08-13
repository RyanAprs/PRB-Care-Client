import  { useEffect } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import useDarkMode from 'use-dark-mode';
import { Button } from "primereact/button";

export const ThemeSwitcher = () => {
    const darkMode = useDarkMode(false);

    useEffect(() => {
        const themeLink = document.getElementById('theme-link');

        if (themeLink) {
            const themeUrl = darkMode.value
                ? new URL('primereact/resources/themes/arya-green/theme.css', import.meta.url).href
                : new URL('primereact/resources/themes/saga-green/theme.css', import.meta.url).href;

            themeLink.href = themeUrl;
        }
    }, [darkMode.value]);

    return (
        <div className="flex justify-center p-4">
            <button
                rounded
                onClick={darkMode.toggle}
                className="p-0.5 rounded-full duration-300 ease-in-out bg-lightGreen dark:bg-mainGreen"
            >
                {darkMode.value ? 
                    <svg width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill='white' d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z">
                    </path>
                    </svg>
                : <MoonIcon fill="white" strokeWidth={0}/>}
            </button>
        </div>
    );
};
