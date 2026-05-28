import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/home/Home";
// ? toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      {/* Bildirishnomalar uchun */}
      <ToastContainer />

      {/* 🌐 Router qismi: Bu yerda faqat Home sahifasi ochiladi. 
          Header esa Home.jsx'ning o'zini ichida chiroyli bo'lib chiqadi */}
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;