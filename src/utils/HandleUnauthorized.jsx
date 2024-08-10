export const HandleUnauthorizedAdminSuper = (response, dispatch, navigate) => {
  if (response) {
    if (response.status === 401) {
      dispatch({ type: "LOGOUT" });
      navigate("/admin/login");
    }
  }
};

export const HandleUnauthorizedAdminPuskesmas = (
  response,
  dispatch,
  navigate
) => {
  if (response) {
    if (response.status === 401) {
      dispatch({ type: "LOGOUT" });
      navigate("/puskesmas/login");
    }
  }
};

export const HandleUnauthorizedAdminApotek = (response, dispatch, navigate) => {
  if (response) {
    if (response.status === 401) {
      dispatch({ type: "LOGOUT" });
      navigate("/apotek/login");
    }
  }
};
