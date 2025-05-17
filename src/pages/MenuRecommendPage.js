import React, { useState, useEffect } from 'react';
import './MenuRecommendPage.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/api'; 


function MenuRecommendPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [region, setRegion] = useState("청파동");
  const [alone, setAlone] = useState("혼자");
  const [budget, setBudget] = useState("1~2만원");
  const [drink, setDrink] = useState("없음");
  const [hunger, setHunger] = useState("보통");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleRecommend = async () => {
    setIsLoading(true);
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const allergies = userProfile.allergies || [];
    const diseases = userProfile.diseases || [];

    const recommendInfo = { region, alone, budget, drink, hunger, allergies, diseases };

    try {
      localStorage.setItem("recommendInfo", JSON.stringify(recommendInfo));

      const response = await fetch(`${API_BASE_URL}/menu-recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recommendInfo),
      });

      if (!response.ok) throw new Error("서버 오류가 발생했습니다.");

      const result = await response.json();
      localStorage.setItem("recommendResult", JSON.stringify(result));
      navigate("/menu-result");
    } catch (error) {
      alert("메뉴 추천 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">
        <span className="word-first">오늘의</span> <span className="word-middle">먹방</span><span className="word-end">은</span>
      </h1>

      <div className="options-section">
        <div className="option region-option">
          <div className="option-title">지역</div>
          <div className="select-wrapper">
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="select-box">
              <option value="갈월동">갈월동</option>
              <option value="청파동">청파동</option>
              <option value="효창동">효창동</option>
              <option value="남영동">남영동</option>
              <option value="학식">학식</option>
            </select>
            <img src="/select.png" alt="선택" className="select-icon" />
          </div>
        </div>

        <div className="option">
          <div className="option-title">혼밥</div>
          <div className="toggle-box">
            <button className={`toggle-option ${alone === "혼자" ? "active" : ""}`} onClick={() => setAlone("혼자")}>혼자</button>
            <button className={`toggle-option ${alone === "같이" ? "active" : ""}`} onClick={() => setAlone("같이")}>같이</button>
          </div>
        </div>

        <div className="option">
          <div className="option-title">예산</div>
          <div className="button-group">
            {["1만원 미만", "1~2만원", "2~3만원", "3~4만원", "4만원 이상"].map(item => (
              <button key={item} className={budget === item ? "active" : ""} onClick={() => setBudget(item)}>{item}</button>
            ))}
          </div>
        </div>

        <div className="option additional-filters">
          <div className="filter-header" onClick={() => setShowFilters(!showFilters)}>
            <div className="option-title">추가 필터</div>
            <span className="toggle-icon">{showFilters ? "▲ 접기" : "▼ 펼치기"}</span>
          </div>

          {showFilters && (
            <div className="sub-filters">
              <div className="sub-option">
                <div className="sub-title">음주</div>
                <div className="button-group">
                  {["없음", "소주", "맥주", "와인"].map(item => (
                    <button key={item} className={drink === item ? "active" : ""} onClick={() => setDrink(item)}>
                      <img src={`/${item}.png`} alt={item} className="drink-icon" />
                      {item}
                    </button>
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
            </div>
          )}
        </div>

        <div className="recommend-button-section">
          <button className="recommend-button" onClick={handleRecommend} disabled={isLoading}>
            {isLoading ? "추천 중..." : "메뉴 추천 받기 🍽️"}
          </button>
        </div>
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

export default MenuRecommendPage;
