import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import ScrollToTop from './components/ScrollToTop'; // Import the scroll logic
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import PlansPage from './pages/pricing.jsx';
import Dashboard from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword';
import PublicChat from './pages/PublicChat';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import APIDocs from './pages/APIDocs';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SuperAdmin from './pages/SuperAdmin';

function App() {
  return (
    <Router>
      {/* 1. ScrollToTop MUST be inside Router to access the URL path, 
        but OUTSIDE Routes so it doesn't cause an error. 
      */}
      <ScrollToTop /> 
      
      <Layout>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat/:botId" element={<PublicChat />} />
          
          {/* Company & Support Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<PlansPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/docs" element={<APIDocs />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/yashkolnure" element={<SuperAdmin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;