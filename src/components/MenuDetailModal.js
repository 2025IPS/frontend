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

        {reason && !Array.isArray(reason) && (
          <ul>
            {reason.liked.length > 0 && (
              <li><strong>좋아하는 재료:</strong> {reason.liked.join(", ")}</li>
            )}
            {reason.disliked.length > 0 && (
              <li><strong>싫어하는 재료:</strong> {reason.disliked.join(", ")}</li>
            )}
            {reason.allergic.length > 0 && (
              <li style={{ color: "red" }}>
                ⚠️ <strong>알레르기 주의:</strong> {reason.allergic.join(", ")}
              </li>
            )}
            {reason.restricted.length > 0 && (
              <li style={{ color: "orange" }}>
                💡 <strong>지병 제한:</strong>{" "}
                {reason.restricted.map(([ing, disease], i) => (
                  <span key={i}>
                    {ing}({disease}){i < reason.restricted.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </li>
            )}
            {reason.liked.length === 0 && reason.disliked.length === 0 && reason.allergic.length === 0 && reason.restricted.length === 0 && (
              <li><em>선호, 비선호 재료가 없어 기본 점수가 부여되었어요.</em></li>
            )}
          </ul>
        )}

        {Array.isArray(reason) && (
          reason.map((item, idx) => (
            <div key={idx} className="reason-box">
              <h4>👤 {item.member} 님</h4>
              <ul>
                {item.reason.liked.length > 0 && (
                  <li><strong>좋아하는 재료:</strong> {item.reason.liked.join(", ")}</li>
                )}
                {item.reason.disliked.length > 0 && (
                  <li><strong>싫어하는 재료:</strong> {item.reason.disliked.join(", ")}</li>
                )}
                {item.reason.allergic.length > 0 && (
                  <li style={{ color: "red" }}>
                    ⚠️ <strong>알레르기 주의:</strong> {item.reason.allergic.join(", ")}
                  </li>
                )}
                {item.reason.restricted.length > 0 && (
                  <li style={{ color: "orange" }}>
                    💡 <strong>지병 제한:</strong>{" "}
                    {item.reason.restricted.map(([ing, disease], i) => (
                      <span key={i}>
                        {ing}({disease}){i < item.reason.restricted.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </li>
                )}
                {item.reason.liked.length === 0 && item.reason.disliked.length === 0 && item.reason.allergic.length === 0 && item.reason.restricted.length === 0 && (
                  <li><em>선호, 비선호 재료가 없어 기본 점수가 부여되었어요.</em></li>
                )}
              </ul>
            </div>
          ))
        )}

        <button onClick={onClose} className="close-button">확인했어요</button>
      </div>
    </div>
  );
}

export default MenuDetailModal;