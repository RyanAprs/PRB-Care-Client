import Cookies from "js-cookie";

export const HandleUnauthorizedAdminSuper = (response, navigate) => {
  if (response.status === 401) {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/admin/login");
  }
};

export const HandleUnauthorizedAdminPuskesmas = (response, navigate) => {
  if (response.status === 401) {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/puskesmas/login");
  }
};

export const HandleUnauthorizedAdminApotek = (response, navigate) => {
  if (response.status === 401) {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/apotek/login");
  }
};
