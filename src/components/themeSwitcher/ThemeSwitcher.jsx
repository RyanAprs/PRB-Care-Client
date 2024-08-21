import  { useEffect } from 'react';
import { MoonIcon, Sun } from 'lucide-react';
import useDarkMode from 'use-dark-mode';
import { Button } from "primereact/button";

export const ThemeSwitcher = ({ className = '' }) => {
    const darkMode = useDarkMode(false);
    useEffect(() => {
        const themeLink = document.getElementById('theme-link');
        if (themeLink) {
            const themeUrl = darkMode.value
                ? new URL('primereact/resources/themes/arya-green/theme.css', import.meta.url).href
                : new URL('primereact/resources/themes/saga-green/theme.css', import.meta.url).href;
            themeLink.href = themeUrl;
        }
        darkMode.value ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    }, [darkMode.value]);

    return (
        <div className={`flex justify-center px-2 ${className}`}>
            <Button
                rounded
                text
                severity="secondary"
                onClick={darkMode.toggle}
                className="p-1 rounded-full duration-300 ease-in-out "
            >
                {darkMode.value ? 
                    <Sun color='white' />
                : <MoonIcon color='black' />}
            </Button>
        </div>
    );
};