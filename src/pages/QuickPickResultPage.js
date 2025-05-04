import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickPickResultPage.css';

function QuickPickResultPage() {
  const [percentage, setPercentage] = useState(0);
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);
  const navigate = useNavigate();

  const menus = [
    { name: "치킨", image: "/chicken.png", percentage: 65 },
    { name: "피자", image: "/pizza.png", percentage: 50 },
    { name: "떡볶이", image: "/tteokbokki.png", percentage: 40 },
  ];

  const targetPercentage = menus[currentMenuIndex].percentage;

  useEffect(() => {
    setPercentage(0);
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev < targetPercentage) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return targetPercentage;
        }
      });
    }, 20);
    return () => clearInterval(interval);
  }, [currentMenuIndex, targetPercentage]);

  const showNextMenu = () => {
    setCurrentMenuIndex((prevIndex) => (prevIndex + 1) % menus.length);
  };

  const goToHome = () => {
    navigate('/home'); // HomePage.js 가 "/" 경로라면
  };

  const viewDetail = () => {
    alert(`${menus[currentMenuIndex].name} 상세 보기에요 (여기서는 alert로 표시했지만 페이지 연결도 가능)`); 
  };

  return (
    <div className="page-container">
      <h1 className="page-title">랜덤 메뉴 추천 <span>완료!</span></h1>

      <div className="result-circle">
        <div className="circle-fill" style={{ height: `${percentage}%` }}></div>

        <div className="circle-inner">
          <img src={menus[currentMenuIndex].image} alt="메뉴" className="menu-image" />
          <h2>{menus[currentMenuIndex].name}</h2>
          <p>{percentage}%</p>
        </div>
      </div>

      <p className="description">
        (닉네임)님의 선호가 {percentage}% 반영된 오늘의 랜덤 메뉴에요!
      </p>

      <div className="result-buttons">
        <button className="common-button" onClick={showNextMenu}>다른 메뉴 보기</button>
        <button className="common-button" onClick={viewDetail}>추천 상세 보기</button>
        <button className="common-button" onClick={goToHome}>메인으로</button>
      </div>
    </div>
  );
}

export default QuickPickResultPage;
