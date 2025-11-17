import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Etapa1 from './Etapa1';
import Etapa2 from './Etapa2';
import Etapa3 from './Etapa3';

export default function CriarClienteRouter() {
  return (
    <Routes>
      <Route path="etapa1" element={<Etapa1 />} />
      <Route path="etapa2" element={<Etapa2 />} />
      <Route path="etapa3" element={<Etapa3 />} />
    </Routes>
  );
}