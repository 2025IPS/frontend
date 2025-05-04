import React, { useState } from 'react';
import './MenuRecommendPage.css';
import { useNavigate } from 'react-router-dom';

function MenuRecommendPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [region, setRegion] = useState("청파동");
  const [alone, setAlone] = useState("혼자");
  const [budget, setBudget] = useState("");
  const [drink, setDrink] = useState("");
  const [hunger, setHunger] = useState("");

  const navigate = useNavigate();

  const handleRecommend = () => {
    navigate("/menu-result");
  };

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
        <div className="option-title">혼밥</div>
        <div className="button-group">
          <button className={alone === "혼자" ? "active" : ""} onClick={() => setAlone("혼자")}>혼자</button>
          <button className={alone === "같이" ? "active" : ""} onClick={() => setAlone("같이")}>같이</button>
        </div>
      </div>

      <div className="option">
        <div className="option-title">예산</div>
        <div className="button-group">
          {["1만원 미만", "1~2만원", "2~3만원", "3~4만원"].map((item) => (
            <button key={item} className={budget === item ? "active" : ""} onClick={() => setBudget(item)}>
              {item}
            </button>
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
              <div className="sub-title">음주</div>
              <div className="button-group">
                {["없음", "소주", "맥주", "와인"].map((item) => (
                  <button key={item} className={drink === item ? "active" : ""} onClick={() => setDrink(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="sub-option">
              <div className="sub-title">공복감</div>
              <div className="button-group">
                {["약간", "보통", "많이"].map((item) => (
                  <button key={item} className={hunger === item ? "active" : ""} onClick={() => setHunger(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="chat-box">
        <div className="chat-message"><b>쫩쫩이</b><br />안녕하세요 쫩쫩이 입니다!<br />오늘은 어떤 먹방을 해볼까요?</div>
        <input className="chat-input" placeholder="눌러서 쫩쫩이와 채팅 시작하기" />
      </div>

      <button className="common-button" onClick={handleRecommend}>메뉴 추천하기</button>
    </div>
  );
}

export default MenuRecommendPage;
