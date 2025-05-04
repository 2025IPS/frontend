import React, { useState } from 'react';
import './Mypage.css';
import { useUserData } from '../UserDataContext';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

function Mypage() {
  const navigate = useNavigate();

  const {
    allergy, setAllergy,
    disease, setDisease,
    preferredMenu, setPreferredMenu,
    dislikedMenu, setDislikedMenu,
  } = useUserData();

  const allergyOptions = ["달걀", "갑각류", "밀", "땅콩/대두", "고기", "콩", "우유"];
  const diseaseOptions = ["고혈압", "저혈압", "당뇨", "신장질환"];
  const menuOptions = ["고기", "버섯"];

  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: "", options: [], onSelect: () => {} });

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
    alert("저장되었습니다!");
    navigate("/home");
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

      <button className="save-button" onClick={handleSave}>저장</button>

      {/* Modal */}
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
