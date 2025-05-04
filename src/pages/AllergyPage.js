import React, { useState } from 'react';
import './AllergyPage.css';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../UserDataContext';

function AllergyPage() {
  const navigate = useNavigate();
  const { setAllergy } = useUserData();

  const allergies = ["달걀", "갑각류", "밀", "땅콩/대두", "고기", "콩", "우유"];
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  const toggleAllergy = (item) => {
    setSelectedAllergies(prev =>
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    setAllergy(selectedAllergies);
    navigate("/disease");
  };

  return (
    <div className="allergy-container">
      <h1 className="allergy-title">알레르기 정보 입력</h1>
      <div className="allergy-buttons">
        {allergies.map(item => (
          <button
            key={item}
            className={`allergy-button ${selectedAllergies.includes(item) ? 'selected' : ''}`}
            onClick={() => toggleAllergy(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <button className="common-button" onClick={handleNext}>다음</button>
    </div>
  );
}

export default AllergyPage;
