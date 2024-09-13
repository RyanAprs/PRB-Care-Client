import {MoonStar , Sun} from 'lucide-react';
import useDarkMode from 'use-dark-mode';
import {Ripple} from 'primereact/ripple';
import {Button} from 'primereact/button';
export const ThemeSwitcher = ({className = ''}) => {
    const darkMode = useDarkMode(false, {classNameDark: "dark"});
    return (
        <div className={`flex justify-center  ${className}`}>
            <Button
                onClick={darkMode.toggle}
                text
                className="p-1 rounded-full cursor-pointer "
                severity={`secondary`}
            >
                {darkMode.value ?
                    <Sun strokeWidth={1.5} color='white'/>
                    : <MoonStar  strokeWidth={1.5} color='#495057'/>}
            </Button>
        </div>
    );
};