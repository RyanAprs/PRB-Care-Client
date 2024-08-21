import React from 'react';
import { ThemeSwitcher } from '../themeSwitcher/ThemeSwitcher';

const NoNavbar = () => {
    return (
        <div>
            <ThemeSwitcher className='hidden'/>
        </div>
    );
};

export default NoNavbar;
