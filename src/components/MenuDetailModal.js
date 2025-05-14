// MenuDetailModal.js
import React from 'react';
import './MenuDetailModal.css';

function MenuDetailModal({ isOpen, onClose, menuName, percentage, reason }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>추천 결과 안내</h2>
        <p><strong>추천 메뉴:</strong> {menuName}</p>
        <p><strong>추천 점수:</strong> {percentage}%</p>

        {reason?.liked?.length > 0 && (
          <p><strong>좋아하는 재료가 들어 있어요:</strong> {reason.liked.join(", ")}</p>
        )}

        {reason?.disliked?.length > 0 && (
          <p><strong>선호하지 않는 재료가 포함되어 있어요:</strong> {reason.disliked.join(", ")}</p>
        )}

        {reason?.allergic?.length > 0 && (
          <p style={{ color: "red" }}>
            <strong>⚠️ 알러지 유의:</strong> {reason.allergic.join(", ")} : 섭취에 주의가 필요해요!
          </p>
        )}

        {reason?.restricted?.length > 0 && (
          <p style={{ color: "orange" }}>
            <strong>💡 건강상 주의:</strong>{" "}
            {reason.restricted.map(([ing, disease], idx) => (
              <span key={idx}>{ing}({disease}){idx < reason.restricted.length - 1 ? ', ' : ''}</span>
            ))} : 해당 재료는 피하는 것이 좋아요.
          </p>
        )}

        <button onClick={onClose} className="close-button">확인했어요</button>
      </div>
    </div>
  );
}

export default MenuDetailModal;
