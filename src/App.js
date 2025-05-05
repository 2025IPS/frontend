import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import RegisterPage from './pages/RegisterPage';
import AllergyPage from './pages/AllergyPage';
import DiseasePage from './pages/DiseasePage';
import PreferencePage from './pages/PreferencePage';
import Mypage from './pages/Mypage';
import HomePage from './pages/HomePage';
import MenuRecommendPage from './pages/MenuRecommendPage';
import QuickPickLoadingPage from './pages/QuickPickLoadingPage';
import QuickPickResultPage from './pages/QuickPickResultPage';
import MenuResultPage from './pages/MenuResultPage';
import AiRecommendPage from './pages/AiRecommendPage';
import LoginPage from './pages/LoginPage';
import { UserDataProvider } from './UserDataContext';
import ChatBotPage from './pages/ChatBotPage';

function App() {
  return (
    <UserDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/allergy" element={<AllergyPage />} />
          <Route path="/disease" element={<DiseasePage />} />
          <Route path="/preference" element={<PreferencePage />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/menu-recommend" element={<MenuRecommendPage />} />
          <Route path="/quickpick-loading" element={<QuickPickLoadingPage />} />
          <Route path="/quickpick-result" element={<QuickPickResultPage />} />
          <Route path="/menu-result" element={<MenuResultPage />} />
          <Route path="/ai-recommend" element={<AiRecommendPage />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
        </Routes>
      </Router>
    </UserDataProvider>
  );
}

export default App;
