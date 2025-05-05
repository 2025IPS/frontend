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

  // 위치 가져오기 → 동 이름으로 가져오기 (여기 수정됨!)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get("https://dapi.kakao.com/v2/local/geo/coord2regioncode.json", {
            params: {
              x: longitude,
              y: latitude
            },
            headers: {
              Authorization: "KakaoAK 815a330dcfb69987a6c219836b68598c"  // 여기에 본인의 카카오 API 키 넣기
            }
          });

          if (response.data.documents.length > 0) {
            const regionName = response.data.documents[0].region_3depth_name;
            setLocation(regionName);  // 동 이름으로 표시
          } else {
            setLocation("지역 정보를 불러올 수 없습니다.");
          }
        } catch (error) {
          console.error("카카오 API 오류:", error);
          setLocation("지역 정보를 가져올 수 없습니다.");
        }
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
