import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickPickResultPage.css';
import MenuDetailModal from '../components/MenuDetailModal';
import axios from 'axios';

function QuickPickResultPage() {
  const [nickname, setNickname] = useState("(닉네임)");
  const [percentage, setPercentage] = useState(0);
  const [targetPercentage, setTargetPercentage] = useState(0);
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);
  const [preferences, setPreferences] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    menuName: "",
    percentage: 0,
    reason: ""
  });

  const navigate = useNavigate();

  const menus = [
    { name: "치킨", image: "/chicken.png" },
    { name: "피자", image: "/pizza.png" },
    { name: "떡볶이", image: "/tteokbokki.png" }
  ];

  // 닉네임 가져오기 (서버에서)
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) return;

    axios.get(`http://localhost:8000/user/${username}`)
      .then(res => {
        setNickname(res.data.name || username);
      })
      .catch(err => {
        console.error("유저 정보 불러오기 실패:", err);
      });
  }, [username]);

  // 사용자 취향 불러오기
  useEffect(() => {
    const storedPreferences = JSON.parse(localStorage.getItem("userPreferences")) || { likes: [], dislikes: [] };
    setPreferences(storedPreferences);
  }, []);

  // 메뉴 변경 or 취향 변경 시 퍼센트 계산
  useEffect(() => {
    if (!preferences) return;

    const currentMenu = menus[currentMenuIndex];
    const calculatedPercentage = calculatePreferencePercentage(currentMenu.name, preferences);

    setTargetPercentage(calculatedPercentage);
    setPercentage(0);

    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev < calculatedPercentage) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return calculatedPercentage;
        }
      });
    }, 20);

    return () => clearInterval(interval);
  }, [currentMenuIndex, preferences]);

  // 퍼센트 계산 함수
  function calculatePreferencePercentage(menuName, preferences) {
    const { likes, dislikes } = preferences;

    if (likes.includes(menuName)) {
      return 80 + Math.floor(Math.random() * 21);
    } else if (dislikes.includes(menuName)) {
      return 10 + Math.floor(Math.random() * 21);
    } else {
      return 40 + Math.floor(Math.random() * 21);
    }
  }

  const showNextMenu = () => {
    setCurrentMenuIndex((prevIndex) => (prevIndex + 1) % menus.length);
  };

  const goToHome = () => {
    navigate('/home');
  };

  const viewDetail = () => {
    const currentMenu = menus[currentMenuIndex];
    const { likes, dislikes } = preferences;

    let reason = "";

    if (likes.includes(currentMenu.name)) {
      reason = "사용자가 좋아하는 메뉴입니다. 따라서 높은 추천 퍼센트가 부여되었습니다.";
    } else if (dislikes.includes(currentMenu.name)) {
      reason = "사용자가 싫어하는 메뉴입니다. 따라서 낮은 추천 퍼센트가 부여되었습니다.";
    } else {
      reason = "사용자의 특별한 선호가 없는 메뉴입니다. 중간 정도 퍼센트가 부여되었습니다.";
    }

    setModalInfo({
      menuName: currentMenu.name,
      percentage: targetPercentage,
      reason
    });
    setIsModalOpen(true);
  };

  const currentMenu = menus[currentMenuIndex];

  return (
    <div className="page-container">
      <h1 className="page-title">랜덤 메뉴 추천 <span>완료!</span></h1>

      <div className="result-circle">
        <div className="circle-fill" style={{ height: `${percentage}%` }}></div>

        <div className="circle-inner">
          <img src={currentMenu.image} alt="메뉴" className="menu-image" />
          <h2>{currentMenu.name}</h2>
          <p>{percentage}%</p>
        </div>
      </div>

      <p className="description">
        <span className="nickname">{nickname}</span>님의 선호가 <span className="percentage">{percentage}%</span> 반영된 오늘의 랜덤 메뉴에요!
        <span className="detail-link" onClick={viewDetail}>추천 상세 보기 &gt;</span>
      </p>

      <div className="result-buttons">
        <button className="common-button other-menu" onClick={showNextMenu}>다른 메뉴</button>
        <button className="common-button main-button" onClick={goToHome}>메인으로</button>
      </div>

      <MenuDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        menuName={modalInfo.menuName}
        percentage={modalInfo.percentage}
        reason={modalInfo.reason}
      />
    </div>
  );
}

export default QuickPickResultPage;
