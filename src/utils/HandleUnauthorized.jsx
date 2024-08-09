export const HandleUnauthorizedAdminSuper = (response, dispatch, navigate) => {
  if(response) {
    if (response.status === 401) {
      dispatch({ type: "LOGOUT" }); 
      navigate("/admin/login");
    }
  }
};

export const HandleUnauthorizedAdminPuskesmas = (response, navigate) => {
  if (response.status === 401) {

    navigate("/puskesmas/login");
  }
};

export const HandleUnauthorizedAdminApotek = (response, navigate) => {
  if (response.status === 401) {

    navigate("/apotek/login");
  }
};
