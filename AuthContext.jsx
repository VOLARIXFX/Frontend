import { createContext, useContext, useState, useEffect } from "react";
import React from "react";
const AuthContext = createContext();

// Helper function to decode JWT payload
const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload;
  } catch (e) {
    console.error("Error decoding JWT token:", e);
    return null;
  }
};



export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("authData");
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      // Try to get expiration from token if not saved explicitly
      let expiration = parsedAuth.expiration;
      if (!expiration && parsedAuth.token) {
          const payload = decodeJwtPayload(parsedAuth.token);
          if(payload && payload.exp) {
              expiration = payload.exp * 1000; // Convert seconds to milliseconds
          }
      }

      // Check if token is expired on load
      if (expiration && expiration < Date.now()) {
          localStorage.removeItem("authData");
          localStorage.removeItem("token");
          return {
              isAuthenticated: false,
              user: null,
              token: null,
              expiration: null
          };
      }

      return {
        isAuthenticated: true,
        user: parsedAuth.user,
        token: parsedAuth.token,
        expiration: expiration || null
      };
    }
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      expiration: null
    };
  });

  useEffect(() => {
    let timer = null;

    if (auth.isAuthenticated && auth.token) {
      const payload = decodeJwtPayload(auth.token);

      if (payload && payload.exp) {
        const expirationTime = payload.exp * 1000; 
        setAuth(prev => ({ ...prev, expiration: expirationTime })); 

        const timeRemaining = expirationTime - Date.now();
        

        if (timeRemaining > 0) {
          timer = setTimeout(() => {
            logout(); 
          }, timeRemaining);
        } else {
          logout();
        }
      } else {
          console.log("Token payload or exp claim missing.", payload);
           if (auth.expiration) {
              setAuth(prev => ({ ...prev, expiration: null }));
           }
      }
    } else {
        console.log("Auth effect running - not authenticated or no token.");
        if (auth.expiration) {
             setAuth(prev => ({ ...prev, expiration: null }));
        }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [auth.token, auth.isAuthenticated]);

  useEffect(() => {
      if (auth.isAuthenticated) {
        localStorage.setItem("authData", JSON.stringify({
          user: auth.user,
          token: auth.token,
          expiration: auth.expiration 
        }));
        localStorage.setItem("token", auth.token);
      } else {
        localStorage.removeItem("authData");
        localStorage.removeItem("token");
      }
  }, [auth.isAuthenticated, auth.user, auth.token, auth.expiration]); 

  const login = (user, token) => {
    const payload = decodeJwtPayload(token);
    const expirationTime = payload && payload.exp ? payload.exp * 1000 : null;

    setAuth({
      isAuthenticated: true,
      user,
      token,
      expiration: expirationTime,
    });
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false, 
      user: null,
      token: null,
      expiration: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

