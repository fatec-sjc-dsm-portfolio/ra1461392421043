import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LangProvider } from './i18n/LangContext';
import { Starfield } from './components/Starfield';
import { Sun } from './components/Hero';
import { Nav } from './components/Nav';
import Home from './pages/Home';
import PythonCourse from './pages/PythonCourse';

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Starfield />
        <div className="page">
          <Sun />
          <Nav />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cursoPython" element={<PythonCourse />} />
              {/* old pages from the previous site */}
              <Route path="/projetos" element={<Navigate to={{ pathname: '/', hash: '#trabalhos' }} replace />} />
              <Route path="/formacao" element={<Navigate to={{ pathname: '/', hash: '#trajetoria' }} replace />} />
              <Route path="/tecnologias" element={<Navigate to={{ pathname: '/', hash: '#tecnologias' }} replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </LangProvider>
  );
}
