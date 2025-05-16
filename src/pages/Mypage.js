import React, { useState, useEffect } from 'react';
import './Mypage.css';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserData } from '../UserDataContext';
import { API_BASE_URL } from '../api/api';

function Mypage() {
  const navigate = useNavigate();

  const {
    allergy, setAllergy,
    disease, setDisease,
    preferredMenu, setPreferredMenu,
    dislikedMenu, setDislikedMenu,
  } = useUserData();

  const username = localStorage.getItem('username');

  const allergyOptions = ["달걀", "갑각류", "밀", "땅콩/대두", "고기", "콩", "우유"];
  const diseaseOptions = ["고혈압", "저혈압", "당뇨", "신장질환"];
  const menuOptions = ["고기", "버섯", "고수", "내장", "닭발", "해산물"];

  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: "", options: [], onSelect: () => {} });

  useEffect(() => {
    if (!username) return;

    axios.get(`${API_BASE_URL}/user/${username}`)
      .then(res => {
        console.log("서버로부터 받은 유저 데이터:", res.data);

        const toArray = (value) =>
          typeof value === 'string'
            ? value.split(',').map(v => v.trim()).filter(Boolean)
            : Array.isArray(value)
            ? value
            : [];

        setAllergy(toArray(res.data.allergies));
        setDisease(toArray(res.data.diseases));
        setPreferredMenu(toArray(res.data.preferred_menu));   // 필드명 정확히 맞춤
        setDislikedMenu(toArray(res.data.disliked_menu));
      })
      .catch(err => {
        console.error("유저 데이터 불러오기 실패:", err);
        setAllergy([]);
        setDisease([]);
        setPreferredMenu([]);
        setDislikedMenu([]);
      });
  }, [username, setAllergy, setDisease, setPreferredMenu, setDislikedMenu]);

  const removeItem = (list, setList, item) => {
    setList(list.filter(i => i !== item));
  };

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

  const closeModal = () => {
    setModalInfo({ ...modalInfo, isOpen: false });
  };

  const handleSave = () => {
    if (!username || username.trim() === "") {
      alert("사용자 정보가 없습니다. 로그인이 필요합니다.");
      return;
    }

    const saveData = {
      username,
      allergies: Array.isArray(allergy) ? allergy.join(', ') : "",
      diseases: Array.isArray(disease) ? disease.join(', ') : "",
      preferred_menu: Array.isArray(preferredMenu) ? preferredMenu.join(', ') : "",
      disliked_menu: Array.isArray(dislikedMenu) ? dislikedMenu.join(', ') : ""
    };

    console.log("서버에 보낼 데이터:", saveData);

    axios.post(`${API_BASE_URL}/mypage/update`, saveData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        alert("저장되었습니다!");
        setTimeout(() => {
          navigate("/home");
        }, 500);
      })
      .catch(err => {
        console.error("저장 오류 상세:", err.response?.data.detail || err);
        alert("저장 중 오류 발생! 콘솔을 확인해주세요.");
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
