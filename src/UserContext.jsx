import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      setLoggedIn(true);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setLoggedIn(false);
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, loggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
