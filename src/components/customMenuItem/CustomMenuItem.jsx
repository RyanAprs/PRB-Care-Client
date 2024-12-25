import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuItem } from "react-pro-sidebar";

const CustomMenuItem = ({ expanded, icon, link, label }) => {
  const location = useLocation();

  return (
    <MenuItem
      className={`${expanded ? "mb-2 " : "mb-3"}`}
      icon={icon}
      component={
        <Link
          to={link}
          className={`flex items-center ${
            expanded ? "justify-center" : ""
          } rounded hover:bg-lightGreen dark:hover:bg-mainGreen ${
            location.pathname === link ? "bg-mainGreen" : ""
          }  transition-all ${
            expanded ? "size-[80%]" : "size-[100%] px-24"
          }`}
        ></Link>
      }
    >
      <h1 className="text-[18px] ml-4 text-center">{label}</h1>
    </MenuItem>
  );
};

export default CustomMenuItem;
