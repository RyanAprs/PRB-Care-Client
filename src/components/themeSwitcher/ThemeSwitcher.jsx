import { MoonIcon, Sun } from 'lucide-react';
import useDarkMode from 'use-dark-mode';
import { Button } from "primereact/button";

export const ThemeSwitcher = ({ className = '' }) => {
    const darkMode = useDarkMode(false,{classNameDark : "dark"});
    return (
        <div className={`flex justify-center  ${className}`}>
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