import React from 'react';
import './MenuDetailModal.css';

function MenuDetailModal({ isOpen, onClose, menuName, percentage, reason }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>추천 상세 보기</h2>
        <p><strong>메뉴:</strong> {menuName}</p>
        <p><strong>추천 퍼센트:</strong> {percentage}%</p>
        <p><strong>추천 이유:</strong> {reason}</p>

        <button onClick={onClose} className="close-button">닫기</button>
      </div>
    </div>
  );
}

export default MenuDetailModal;
