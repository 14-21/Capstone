import './App.css'
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useState, createContext, useEffect } from "react";
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import AllReviews from './components/AllReviews';
import Login from './components/Login';
import Register from './components/Register';

export const LoginContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Checking if user is logged in with token.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <>
    {/* Giving access to login info to all components */}
    <LoginContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      <Navbar />

      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<AllReviews />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </LoginContext.Provider>
    </>
  )
}

export default App;
