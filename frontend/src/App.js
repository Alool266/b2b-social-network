// Made written by ali hasan
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import ConnectionsPage from './pages/ConnectionsPage';
import MessagesPage from './pages/MessagesPage';
import JobsPage from './pages/JobsPage';
import EventsPage from './pages/EventsPage';
import GroupsPage from './pages/GroupsPage';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import HelpCenterPage from './pages/HelpCenterPage';
import ContactPage from './pages/ContactPage';
import DocumentationPage from './pages/DocumentationPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SecurityPage from './pages/SecurityPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile/:companyId" element={<ProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:companyId" element={<MessagesPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminPage /></ProtectedRoute>} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/security" element={<SecurityPage />} />
      </Routes>
    </div>
  );
}

export default App;
