import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ Component }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return <Component />;
}

export default ProtectedRoute;