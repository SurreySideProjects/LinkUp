import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NoPage from './components/NoPage/NoPage';
import Login from './components/Login/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<App />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Login />}/>
        <Route path="*" element={<NoPage />} />
    </Routes>
  </BrowserRouter>
);

