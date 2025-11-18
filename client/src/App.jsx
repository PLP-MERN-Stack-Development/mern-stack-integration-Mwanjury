import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SinglePost from './pages/SinglePost';
import CreateEdit from './pages/CreateEdit';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<SinglePost />} />
          <Route path="/create" element={<CreateEdit />} />
          <Route path="/edit/:id" element={<CreateEdit editMode />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
    </>
  );
}
