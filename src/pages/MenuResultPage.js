import React from 'react';
import './MenuResultPage.css';

function MenuResultPage() {
  return (
    <div className="result-container">
      <h1 className="result-title">메뉴 추천 완료 !</h1>

      <h2 className="result-menu">삼겹살</h2>

      <div className="result-image-box">
        <img
          src="https://i.ibb.co/wMpkJpg/sample-samgyeopsal.jpg" 
          alt="삼겹살"
          className="result-image"
        />
        <div className="result-restaurant-info">
          <h3>남영돈</h3>
          <div className="tags">
            <span className="tag">도보 15분</span>
            <span className="tag">15,000원 ~</span>
          </div>
          <div className="tags">
            <span className="tag">대표 메뉴: 삼겹살, 오겹살, 냉면</span>
          </div>
        </div>
      </div>

      <button className="other-button">다른 메뉴 추천</button>

      <div className="bottom-nav">
        <button>홈</button>
        <button>저장</button>
        <button>마이페이지</button>
      </div>
    </div>
  );
}

export default MenuResultPage;
