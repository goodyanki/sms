import { Navigate, Outlet } from "react-router-dom";

//
const isAuthenticated = () => {
  return localStorage.getItem("isLogin") === "11"
};

export default function PrivateRoute() {
  if(isAuthenticated())
  {
    return <Outlet />;
  }
  else
  {
      return <Navigate to="/auth"/>;
  }
}
