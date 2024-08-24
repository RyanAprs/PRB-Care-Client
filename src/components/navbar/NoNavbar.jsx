import React from 'react';
import { ThemeSwitcher } from '../themeSwitcher/ThemeSwitcher';

const NoNavbar = ({className=""}) => {
    return (
        <div className={className !== "" ? className : "hidden"}>
            <ThemeSwitcher />
        </div>
    );
};

export default NoNavbar;
