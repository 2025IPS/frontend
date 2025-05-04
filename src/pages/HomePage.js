import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import axios from 'axios';

function HomePage() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("(닉네임)");
  const [location, setLocation] = useState("위치를 가져오는 중...");

  const username = localStorage.getItem('username');

  // 닉네임 불러오기
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

  // 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`);
      },
      (error) => {
        console.error("위치 가져오기 오류:", error);
        setLocation("위치 정보를 가져올 수 없습니다.");
      }
    );
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title"><span>오늘의</span> 먹방은</h1>

      <img src="/chef.png" alt="Chef" className="home-image" />
      <h2 className="nickname">{nickname}</h2>

      <button className="location-button">{location}</button>
      <button className="common-button" onClick={() => navigate("/menu-recommend")}>메뉴 추천</button>

      <div className="home-buttons">
        <button className="home-sub-button" onClick={() => navigate("/quickpick-loading")}>퀵픽</button>
      </div>
    </div>
  );
}

export default HomePage;
