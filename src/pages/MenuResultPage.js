import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuResultPage.css';
import { API_BASE_URL } from '../api/api';

function MenuResultPage() {
  const navigate = useNavigate();

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [imgTryIndex, setImgTryIndex] = useState(0);

  const hasFetched = useRef(false);

  const savedInfo = JSON.parse(localStorage.getItem("recommendInfo"));
  const userId = localStorage.getItem("user_id");

  const toFileName = (text) => text.trim().replace(/\s+/g, "_");

  useEffect(() => {
    if (!savedInfo || hasFetched.current) return;
    hasFetched.current = true;

    const payload = {
      ...savedInfo,
      user_id: userId ? parseInt(userId) : null,
    };

    fetch(`${API_BASE_URL}/api/menu-recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("서버 오류");
        return res.json();
      })
      .then((data) => {
        setRecommendation(data);
      })
      .catch((err) => {
        console.error("추천 요청 실패:", err);
        setError("추천을 가져오는 데 실패했습니다. 다시 시도해 주세요.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!recommendation) return;

    const baseFileName = `${toFileName(recommendation.place_name)}_${toFileName(recommendation.menu_name)}`;
    setImageSrc(`/menu-images/${baseFileName}.jpg`);
    setImgTryIndex(0);
  }, [recommendation]);

  const handleImageError = () => {
    if (!recommendation) return;

    const baseFileName = `${toFileName(recommendation.place_name)}_${toFileName(recommendation.menu_name)}`;
    const extensions = [".jpeg", ".png"];
    const nextIndex = imgTryIndex;

    if (nextIndex < extensions.length) {
      setImageSrc(`/menu-images/${baseFileName}${extensions[nextIndex]}`);
      setImgTryIndex(nextIndex + 1);
    } else {
      setImageSrc("/menu-images/기타.jpg");
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

const handleFeedback = (type) => {
  if (!recommendation) return;

  fetch(`${API_BASE_URL}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      place_name: recommendation.place_name,
      menu_name: recommendation.menu_name,
      feedback: type,
      user_id: userId ? parseInt(userId) : null,
      menu_id: recommendation.menu_id,         // ✅ 추가
      restaurant_id: recommendation.restaurant_id // ✅ 추가
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("피드백 전송 실패");
      return res.json();
    })
    .then(() => {
      alert("피드백이 반영되었습니다!");
    })
    .catch((err) => {
      console.error(err);
      alert("피드백 전송에 실패했습니다.");
    });
};

  if (loading) {
    return (
      <div className="result-container">
        <h1>추천 중이에요 🍳</h1>
        <p>최적의 메뉴를 찾고 있습니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-container">
        <h1>에러 발생</h1>
        <p>{error}</p>
        <button onClick={handleRetry}>다시 시도하기</button>
      </div>
    );
  }

  return (
    <div className="result-container">
      {/* 캐릭터 이미지 */}
      <img src="/chef.png" alt="캐릭터" className="character-image" />

      <h1 className="result-title">메뉴 추천 완료 !</h1>
      <h2 className="result-menu">{recommendation.menu_name}</h2>

      <div className="result-image-box">
        <img
          src={imageSrc}
          alt={recommendation.menu_name}
          className="result-image"
          onError={handleImageError}
        />
        <div className="result-restaurant-info">
          <h3>{recommendation.place_name}</h3>
          <div className="tags">
            <span className="tag">{recommendation.distance}</span>
            <span className="tag">{recommendation.menu_price}원</span>
            <span className="tag">주소: {recommendation.address}</span>
            <a href={recommendation.url} target="_blank" rel="noreferrer" className="tag">
              네이버에서 보기
            </a>
          </div>
        </div>

        <div className="feedback-buttons">
          <div className="feedback-button" onClick={() => handleFeedback("good")}>
            <img src="/icons/good.png" alt="좋아요" />
          </div>
          <div className="feedback-button" onClick={() => handleFeedback("bad")}>
            <img src="/icons/bad.png" alt="싫어요" />
          </div>
        </div>

        <button className="other-button" onClick={() => navigate(-1)}>
          다른 메뉴 추천
        </button>
      </div>

      <div className="navigation-tabs">
        <button className="nav-tab" onClick={() => navigate("/home")}>
          <img src="/home.png" alt="홈" className="tab-icon" />
        </button>
        <button className="nav-tab" onClick={() => navigate("/chatbot")}>
          <img src="/movetomypage.png" alt="챗봇" className="tab-icon" />
        </button>
        <button className="nav-tab" onClick={() => navigate("/mypage")}>
          <img src="/mypage.png" alt="마이페이지" className="tab-icon" />
        </button>
      </div>
    </div>
  );
}

export default MenuResultPage;
