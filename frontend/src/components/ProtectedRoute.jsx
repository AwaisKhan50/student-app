import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // 1) try cookie-based auth
      try {
        const res = await axios.get("http://localhost:5000/check-auth", {
          withCredentials: true,
        });
        if (res.status === 200) {
          setAuthenticated(true);
          setLoading(false);
          return;
        }
      } catch (cookieErr) {
        // ignore, try token fallback
        console.debug('cookie auth failed', cookieErr);
      }

      // 2) fallback: try token from localStorage in Authorization header
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (token) {
        try {
          const res2 = await axios.get("http://localhost:5000/check-auth", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res2.status === 200) {
            setAuthenticated(true);
            setLoading(false);
            return;
          }
        } catch (headerErr) {
          // fall through to unauthenticated
          console.debug('header auth failed', headerErr);
        }
      }

      setAuthenticated(false);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
