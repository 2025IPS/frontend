import React, { useState, useEffect } from 'react';
import './MenuRecommendPage.css';
import { useNavigate } from 'react-router-dom';

// ✅ API Base URL (관리 쉽게 상수로 선언)
const API_BASE_URL = "http://localhost:8000/api";

function MenuRecommendPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [region, setRegion] = useState("청파동");
  const [alone, setAlone] = useState("혼자");
  const [budget, setBudget] = useState("1~2만원");
  const [drink, setDrink] = useState("없음");
  const [hunger, setHunger] = useState("보통");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // 이전 선택 값 복원
  useEffect(() => {
    const savedInfo = localStorage.getItem("recommendInfo");
    if (savedInfo) {
      const parsedInfo = JSON.parse(savedInfo);
      setRegion(parsedInfo.region || "청파동");
      setAlone(parsedInfo.alone || "혼자");
      setBudget(parsedInfo.budget || "1~2만원");
      setDrink(parsedInfo.drink || "없음");
      setHunger(parsedInfo.hunger || "보통");
    }
  }, []);

  // 메뉴 추천 요청 함수
  const handleRecommend = async () => {
    setIsLoading(true);

    const recommendInfo = { region, alone, budget, drink, hunger };

    try {
      localStorage.setItem("recommendInfo", JSON.stringify(recommendInfo));

      const response = await fetch(`${API_BASE_URL}/menu-recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recommendInfo),
      });

      if (!response.ok) {
        throw new Error("서버 오류가 발생했습니다.");
      }

      const result = await response.json();
      localStorage.setItem("recommendResult", JSON.stringify(result));
      navigate("/menu-result");

    } catch (error) {
      console.error("메뉴 추천 에러:", error);
      alert("메뉴 추천 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormComplete = region && alone && budget;

  return (
    <div className="page-container">
      <h1 className="page-title"><span>오늘의</span> 먹방은</h1>

      <div className="option">
        <div className="option-title">지역</div>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="select-box">
          <option value="갈월동">갈월동</option>
          <option value="청파동">청파동</option>
          <option value="효창동">효창동</option>
          <option value="남영동">남영동</option>
        </select>
      </div>

      <div className="option">
        <div className="option-title">혼밥 여부</div>
        <div className="button-group">
          {["혼자", "같이"].map(item => (
            <button key={item} className={alone === item ? "active" : ""} onClick={() => setAlone(item)}>{item}</button>
          ))}
        </div>
      </div>

      <div className="option">
        <div className="option-title">예산</div>
        <div className="button-group">
          {["1만원 미만", "1~2만원", "2~3만원", "3~4만원"].map(item => (
            <button key={item} className={budget === item ? "active" : ""} onClick={() => setBudget(item)}>{item}</button>
          ))}
        </div>
      </div>

      <div className="option">
        <div className="option-title filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          추가 필터 {showFilters ? "▲ 접기" : "▼ 펼치기"}
        </div>

        {showFilters && (
          <>
            <div className="sub-option">
              <div className="sub-title">음주 여부</div>
              <div className="button-group">
                {["없음", "소주", "맥주", "와인"].map(item => (
                  <button key={item} className={drink === item ? "active" : ""} onClick={() => setDrink(item)}>{item}</button>
                ))}
              </div>
            </div>

            <div className="sub-option">
              <div className="sub-title">공복감</div>
              <div className="button-group">
                {["약간", "보통", "많이"].map(item => (
                  <button key={item} className={hunger === item ? "active" : ""} onClick={() => setHunger(item)}>{item}</button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="chat-box">
        <div className="chat-message"><b>쫩쫩이</b><br />안녕하세요 쫩쫩이입니다!<br />오늘은 어떤 먹방을 해볼까요?</div>
        <input
          className="chat-input"
          placeholder="눌러서 쫩쫩이와 채팅 시작하기"
          readOnly
          onClick={() => navigate("/chatbot")}
        />
      </div>

      <button
        className={`common-button ${isLoading ? 'loading' : ''} ${!isFormComplete ? 'disabled' : ''}`}
        onClick={handleRecommend}
        disabled={isLoading || !isFormComplete}
      >
        {isLoading ? '추천 중...' : '메뉴 추천하기'}
      </button>
    </div>
  );
}

export default MenuRecommendPage;
