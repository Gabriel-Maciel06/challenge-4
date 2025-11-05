import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Pacientes from "../pages/Pacientes";
import PacienteDetalhe from "../pages/PacienteDetalhe";
import Consultas from "../pages/Consultas";
import Integrantes from "../pages/Integrantes";
import IntegranteDetalhe from "../pages/IntegranteDetalhe";
import Sobre from "../pages/Sobre";
import FAQ from "../pages/FAQ";
import Contato from "../pages/Contato";
import PreConsulta from "../pages/PreConsulta";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
  <Route path="/pacientes" element={<Pacientes />} />
  <Route path="/pacientes/:id" element={<PacienteDetalhe />} />
  <Route path="/consultas" element={<Consultas />} />
  <Route path="/integrantes" element={<Integrantes />} />
  <Route path="/integrantes/:rm" element={<IntegranteDetalhe />} />
      <Route path="/pre-consulta/:id" element={<PreConsulta />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
