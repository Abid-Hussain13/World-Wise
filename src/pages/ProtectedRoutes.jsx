import React, { useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const { isAuthenticated } = useAuth();
  const nevigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) {
        nevigate("/");
      }
    },
    [isAuthenticated, nevigate]
  );
  return isAuthenticated ? children : null;
}
