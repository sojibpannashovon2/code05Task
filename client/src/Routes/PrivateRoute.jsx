// components/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <progress className="progress w-56"></progress>;
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
