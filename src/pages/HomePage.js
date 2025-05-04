import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="page-title"><span>오늘의</span> 먹방은</h1>

      <img src="/chef.png" alt="Chef" className="home-image" />
      <h2 className="nickname">(닉네임)</h2>

      <button className="location-button">위치</button>
      <button className="common-button" onClick={() => navigate("/menu-recommend")}>메뉴 추천</button>

      <div className="home-buttons">
        <button className="home-sub-button" onClick={() => navigate("/quickpick-loading")}>퀵픽</button>
      </div>
    </div>
  );
}

export default HomePage;
