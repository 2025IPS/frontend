import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuResultPage.css';

// ✅ API Base URL
const API_BASE_URL = "http://localhost:8000/api";

function MenuResultPage() {
  const navigate = useNavigate();

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 로컬스토리지에서 추천 정보 불러오기 (location.state는 새로고침하면 날아감)
  const savedInfo = JSON.parse(localStorage.getItem("recommendInfo"));

  useEffect(() => {
    if (!savedInfo) {
      setError("추천 정보가 없습니다. 처음부터 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/menu-recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(savedInfo)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("서버 오류");
        }
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

  const handleRetry = () => {
    window.location.reload();  // 새로고침으로 재시도
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
        <h1>에러 발생 ⚡</h1>
        <p>{error}</p>
        <button onClick={handleRetry}>다시 시도하기</button>
      </div>
    );
  }

  return (
    <div className="result-container">
      <h1 className="result-title">메뉴 추천 완료 !</h1>

      <h2 className="result-menu">{recommendation.menu_name}</h2>

      <div className="result-image-box">
        <img
          src="https://i.ibb.co/wMpkJpg/sample-samgyeopsal.jpg"
          alt="메뉴 이미지"
          className="result-image"
        />
        <div className="result-restaurant-info">
          <h3>{recommendation.place_name}</h3>
          <div className="tags">
            <span className="tag">{recommendation.distance}</span>
            <span className="tag">{recommendation.menu_price}원</span>
          </div>
          <div className="tags">
            <span className="tag">주소: {recommendation.address}</span>
          </div>
          <div className="tags">
            <a href={recommendation.url} target="_blank" rel="noreferrer" className="tag">네이버에서 보기</a>
          </div>
        </div>
      </div>

      <button className="other-button" onClick={() => navigate(-1)}>다른 메뉴 추천</button>

      <div className="bottom-nav">
        <button onClick={() => navigate("/")}>홈</button>
        <button>저장</button>
        <button onClick={() => navigate("/mypage")}>마이페이지</button>
      </div>
    </div>
  );
}

export default MenuResultPage;
