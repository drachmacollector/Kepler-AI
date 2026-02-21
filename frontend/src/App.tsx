import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { LandingPage } from '@/pages/LandingPage';

function App() {
  return (
    <div className="bg-[#020617] min-h-screen text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
