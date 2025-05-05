import React, { useState, useEffect } from 'react';
import './Mypage.css';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserData } from '../UserDataContext';

function Mypage() {
  const navigate = useNavigate();

  // Context에서 사용자 데이터 가져오기
  const {
    allergy, setAllergy,
    disease, setDisease,
    preferredMenu, setPreferredMenu,
    dislikedMenu, setDislikedMenu,
  } = useUserData();

  const username = localStorage.getItem('username');

  const allergyOptions = ["달걀", "갑각류", "밀", "땅콩/대두", "고기", "콩", "우유"];
  const diseaseOptions = ["고혈압", "저혈압", "당뇨", "신장질환"];
  const menuOptions = ["고기", "버섯"];

  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: "", options: [], onSelect: () => {} });

  // 사용자 데이터 불러오기
  useEffect(() => {
    if (!username) return;

    axios.get(`http://localhost:8000/user/${username}`)
      .then(res => {
        setAllergy(res.data.allergies ?? []);
        setDisease(res.data.diseases ?? []);
        setPreferredMenu(res.data.preferred_menu ?? []);
        setDislikedMenu(res.data.disliked_menu ?? []);
      })
      .catch(err => console.error("유저 데이터 불러오기 실패:", err));
  }, [username, setAllergy, setDisease, setPreferredMenu, setDislikedMenu]);

  // 태그 삭제
  const removeItem = (list, setList, item) => {
    setList(list.filter(i => i !== item));
  };

  // 모달 열기
  const openModal = (title, options, list, setList) => {
    const available = options.filter(o => !list.includes(o));
    if (available.length === 0) {
      alert("추가할 수 있는 항목이 없습니다.");
      return;
    }

    setModalInfo({
      isOpen: true,
      title,
      options: available,
      onSelect: (selected) => {
        setList([...list, selected]);
        closeModal();
      }
    });
  };

  // 모달 닫기
  const closeModal = () => {
    setModalInfo({ ...modalInfo, isOpen: false });
  };

  // 저장하기
  const handleSave = () => {
    if (!username) {
      console.error("사용자 정보가 없습니다. 로그인이 필요합니다.");
      alert("사용자 정보가 없습니다. 로그인이 필요합니다.");
      return;
    }

    const saveData = {
      username,
      allergies: allergy.join(","),         // 서버로 전송용 (문자열)
      diseases: disease.join(","),          // ✅ 추가: 지병도 서버로 저장
      preferred_menu: preferredMenu.join(","),
      disliked_menu: dislikedMenu.join(","),
    };

    // 📌 LocalStorage에 저장 (MenuRecommendPage에서 사용 가능하도록)
    const userProfile = {
      username,
      allergies: allergy,                   // 리스트 형태로 저장
      diseases: disease                     // 리스트 형태로 저장
    };
    localStorage.setItem("userProfile", JSON.stringify(userProfile));

    // 서버 저장
    axios.post("http://localhost:8000/mypage/update", saveData)
      .then(() => {
        alert("저장되었습니다!");
        setTimeout(() => {
          navigate("/home");
        }, 500);
      })
      .catch(err => {
        console.error("저장 오류:", err);
        alert("저장 중 오류 발생! 세부 내용은 콘솔을 확인해주세요.");
      });
  };

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>

      {/* 지병 */}
      <div className="mypage-item">
        <strong>지병</strong>
        <div className="mypage-tags">
          {disease.map(item => (
            <span className="tag" key={item}>
              {item}
              <button className="remove-button" onClick={() => removeItem(disease, setDisease, item)}>×</button>
            </span>
          ))}
          <button className="add-button" onClick={() => openModal("지병 추가", diseaseOptions, disease, setDisease)}>＋</button>
        </div>
      </div>

      {/* 알러지 */}
      <div className="mypage-item">
        <strong>알러지</strong>
        <div className="mypage-tags">
          {allergy.map(item => (
            <span className="tag" key={item}>
              {item}
              <button className="remove-button" onClick={() => removeItem(allergy, setAllergy, item)}>×</button>
            </span>
          ))}
          <button className="add-button" onClick={() => openModal("알러지 추가", allergyOptions, allergy, setAllergy)}>＋</button>
        </div>
      </div>

      {/* 선호 메뉴 */}
      <div className="mypage-item">
        <strong>선호 메뉴</strong>
        <div className="mypage-tags">
          {preferredMenu.map(item => (
            <span className="tag" key={item}>
              {item}
              <button className="remove-button" onClick={() => removeItem(preferredMenu, setPreferredMenu, item)}>×</button>
            </span>
          ))}
          <button className="add-button" onClick={() => openModal("선호 메뉴 추가", menuOptions, preferredMenu, setPreferredMenu)}>＋</button>
        </div>
      </div>

      {/* 비선호 메뉴 */}
      <div className="mypage-item">
        <strong>비선호 메뉴</strong>
        <div className="mypage-tags">
          {dislikedMenu.map(item => (
            <span className="tag" key={item}>
              {item}
              <button className="remove-button" onClick={() => removeItem(dislikedMenu, setDislikedMenu, item)}>×</button>
            </span>
          ))}
          <button className="add-button" onClick={() => openModal("비선호 메뉴 추가", menuOptions, dislikedMenu, setDislikedMenu)}>＋</button>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="button-container">
        <button className="save-button" onClick={handleSave}>저장</button>
      </div>

      {/* 모달 */}
      <Modal
        isOpen={modalInfo.isOpen}
        title={modalInfo.title}
        options={modalInfo.options}
        onSelect={modalInfo.onSelect}
        onClose={closeModal}
      />
    </div>
  );
}

export default Mypage;
