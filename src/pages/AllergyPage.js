import React, { useState, useEffect } from 'react';
import './AllergyPage.css';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../UserDataContext';
import axios from 'axios';
import { API_BASE_URL } from '../api/api';

function AllergyPage() {
  const navigate = useNavigate();
  const { setAllergy } = useUserData();

  const allergies = ["달걀", "갑각류", "밀", "땅콩/대두", "고기", "콩", "우유"];
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) return;

    axios.get(`${API_BASE_URL}/user/${username}`)
      .then(res => {
        const existing = res.data.allergies;
        const toArray = (value) =>
          typeof value === 'string' ? value.split(',').map(v => v.trim()).filter(Boolean) : (Array.isArray(value) ? value : []);
        setSelectedAllergies(toArray(existing));
      })
      .catch(err => {
        console.error("기존 알러지 데이터 불러오기 실패:", err);
      });
  }, []);

  const toggleAllergy = (item) => {
    setSelectedAllergies(prev =>
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleNext = async () => {
    setAllergy(selectedAllergies);
    const username = localStorage.getItem("username");

    try {
      const prev = await axios.get(`${API_BASE_URL}/user/${username}`);

      // ✅ 빈 값 제거 후 문자열로 변환
      const cleanedAllergies = selectedAllergies.filter(Boolean).join(', ');
      const cleanedDiseases = Array.isArray(prev.data.diseases)
        ? prev.data.diseases.filter(Boolean).join(', ')
        : "";

      await axios.post(`${API_BASE_URL}/mypage/update`, {
        username,
        allergies: cleanedAllergies,
        diseases: cleanedDiseases,
        prefers: prev.data.prefers || [],
        dislikes: prev.data.dislikes || []
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      navigate("/disease");
    } catch (error) {
      console.error("알러지 저장 실패:", error);
      alert("저장 중 오류 발생. 콘솔을 확인하세요.");
    }
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
