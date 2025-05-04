import React, { useState } from 'react';
import './PreferencePage.css';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../UserDataContext';

function PreferencePage() {
  const navigate = useNavigate();
  const { setPreferredMenu, setDislikedMenu } = useUserData();

  const items = [
    { name: "고기", image: "/고기.png" },
    { name: "버섯", image: "/버섯.png" }
  ];

  const [preferences, setPreferences] = useState({});

  const handlePreferenceChange = (itemName, value) => {
    setPreferences(prev => ({
      ...prev,
      [itemName]: value
    }));
  };

  const handleSave = () => {
    const liked = [];
    const disliked = [];

    Object.keys(preferences).forEach((key) => {
      if (preferences[key] === "좋아요") liked.push(key);
      if (preferences[key] === "싫어요") disliked.push(key);
    });

    setPreferredMenu(liked);
    setDislikedMenu(disliked);

    navigate("/mypage");
  };

  return (
    <div className="preference-container">
      <h1 className="preference-title">음식 <span>취향</span>을 알려주세요!</h1>

      <div className="preference-list">
        {items.map((item) => (
          <div className="preference-item" key={item.name}>
            <img src={item.image} alt={item.name} className="preference-image" />
            <div className="preference-name">{item.name}</div>
            <div className="preference-options">
              {["좋아요", "보통", "싫어요"].map(option => (
                <label
                  key={option}
                  className={`preference-option ${preferences[item.name] === option ? 'selected' : ''}`}
                  onClick={() => handlePreferenceChange(item.name, option)}
                >
                  <input type="radio" name={item.name} value={option} />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="save-button" onClick={handleSave}>저장</button>
    </div>
  );
}

export default PreferencePage;
