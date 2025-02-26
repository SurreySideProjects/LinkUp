import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NoPage from './components/NoPage/NoPage';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Groups from './components/Groups/Groups';
import Events from './components/Events/Events';
import Event from './components/Event/Event';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<App />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/groups" element={<Groups />}/>
        <Route path="/events" element={<Events />}/>
        <Route path="/events/:id" element={<Event />}/>
        <Route path="*" element={<NoPage />} />
    </Routes>
  </BrowserRouter>
);

