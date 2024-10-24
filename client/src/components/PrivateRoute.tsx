import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";

interface PrivateRouteProps {
  children: React.ReactElement;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner
  }

  return user ? children : <Navigate to="/" />;
}

export default PrivateRoute;
