import {MoonStar , Sun} from 'lucide-react';
import useDarkMode from 'use-dark-mode';
import {Ripple} from 'primereact/ripple';

export const ThemeSwitcher = ({className = ''}) => {
    const darkMode = useDarkMode(false, {classNameDark: "dark"});
    return (
        <div className={`flex justify-center  ${className}`}>
            <button
                onClick={darkMode.toggle}
                className="p-1 p-ripple rounded-full duration-300 ease-in-out "
            >
                {darkMode.value ?
                    <Sun strokeWidth={1.5} color='white'/>
                    : <MoonStar  strokeWidth={1.5} color='black'/>}
                <Ripple />
            </button>
        </div>
    );
};