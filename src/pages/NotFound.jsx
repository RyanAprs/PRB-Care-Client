import React from "react";
import Cookies from "js-cookie";

const NotFound = () => {
  //   const authCookie = Cookies.get("auth");

  //   const { token, role } = JSON.parse(authCookie);

  //   console.log(token, role);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-darkColor dark:text-white mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8 dark:text-white">Page Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
