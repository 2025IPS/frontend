import React, { useState } from 'react';
import './DiseasePage.css';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../UserDataContext';

function DiseasePage() {
  const navigate = useNavigate();
  const { setDisease } = useUserData();

  const diseases = ["고혈압", "저혈압", "당뇨", "신장질환"];
  const [selectedDiseases, setSelectedDiseases] = useState([]);

  const toggleDisease = (item) => {
    setSelectedDiseases(prev =>
      prev.includes(item) ? prev.filter(d => d !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    setDisease(selectedDiseases);
    navigate("/preference");
  };

  return (
    <div className="disease-container">
      <h1 className="disease-title">지병 정보 입력</h1>
      <div className="disease-buttons">
        {diseases.map(item => (
          <button
            key={item}
            className={`disease-button ${selectedDiseases.includes(item) ? 'selected' : ''}`}
            onClick={() => toggleDisease(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <button className="common-button" onClick={handleNext}>다음</button>
    </div>
  );
}

export default DiseasePage;
