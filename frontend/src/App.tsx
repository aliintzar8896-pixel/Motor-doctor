import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { EmergencyRequestModal } from './components/emergency/EmergencyRequestModal';
import { Toaster } from 'sonner';

// Pages
import { Home } from './pages/Home';
import { EmergencyAssistance } from './pages/EmergencyAssistance';
import { BillDoctorPage } from './pages/BillDoctorPage';
import { MechanicPortal } from './pages/MechanicPortal';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { HighwaySafetyPage } from './pages/HighwaySafetyPage';
import { AuthPage } from './pages/AuthPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ContactUs } from './pages/ContactUs';

export const AppContent: React.FC = () => {
  const [isGlobalSOSModalOpen, setIsGlobalSOSModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <Navbar onOpenSOSModal={() => setIsGlobalSOSModalOpen(true)} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/emergency" element={<EmergencyAssistance />} />
          <Route path="/bill-doctor" element={<BillDoctorPage />} />
          <Route path="/mechanic-portal" element={<MechanicPortal />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/safety" element={<HighwaySafetyPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global SOS Breakdown Request Modal */}
      <EmergencyRequestModal
        isOpen={isGlobalSOSModalOpen}
        onClose={() => setIsGlobalSOSModalOpen(false)}
      />

      <Toaster 
        position="top-right" 
        richColors 
        theme="dark"
        toastOptions={{
          style: {
            background: '#0f172a',
            borderColor: '#334155',
            color: '#f8fafc',
          },
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
