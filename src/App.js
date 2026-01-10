import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import ScrollToTop from './components/ScrollToTop'; 
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import PlansPage from './pages/pricing.jsx';
import Dashboard from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword';
import UseCases from './pages/UseCases.jsx';
import PublicChat from './pages/PublicChat';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import FeaturesPage from './pages/FeaturesPage';
import HelpCenter from './pages/HelpCenter';
import APIDocs from './pages/APIDocs';
import ChatbotPage from './pages/ChatbotPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SuperAdmin from './pages/SuperAdmin';
import NotFound from './pages/NotFound'; // 1. Import your new 404 Page
import FAQPage from './pages/FAQPage.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop /> 
      
      <Layout>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/chat/:botId" element={<PublicChat />} />
          
          {/* Company & Support Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<PlansPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/docs" element={<APIDocs />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/yashkolnure" element={<SuperAdmin />} />

          {/* 2. THE 404 CATCH-ALL ROUTE */}
          {/* This MUST be the last route in the list */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

// Meta/Facebook SDK Initialization
window.fbAsyncInit = function () {
  window.FB.init({
    appId: process.env.REACT_APP_META_APP_ID,
    cookie: true,
    xfbml: false,
    version: "v19.0"
  });
};

export default App;