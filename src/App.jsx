import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/home/Home";
// ? toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 🔥 VERCEL ANALYTICS IMPORТI (Tepasiga qo'shildi)
import { Analytics } from '@vercel/analytics/react';

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

      {/* 📊 VERCEL ANALYTICS KOMPONENTI (Eng pastiga, App ichiga joylashtirildi) */}
      <Analytics />
    </div>
  );
}

export default App;