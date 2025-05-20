import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistoryPage.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/api';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // ✅ 처음에 10개 표시
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (userId) {
      axios.get(`${API_BASE_URL}/history/${userId}`)
        .then(res => {
          const allHistory = res.data;

          // 최신순 정렬 → 싫어요 제외
          const sorted = allHistory
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .filter(item => item.feedback !== "bad");

          setHistory(sorted);
        })
        .catch(err => {
          console.error("히스토리 불러오기 실패:", err);
        });
    }
  }, [userId]);

  const handleReviewClick = (item) => {
    navigate('/review', {
      state: {
        place: item.place_name,
        menu: item.menu_name,
        image: item.image_url,
        restaurant_id: item.restaurant_id,
        menu_id: item.menu_id,
      }
    });
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <div className="history-page">
      <h1 className="history-title">히스토리</h1>

      <div className="history-list">
        {history.slice(0, visibleCount).map((item, index) => (
          <div key={index} className="history-card">
            <div className="place-info">
              <strong className="place-name">{item.place_name}</strong>
              <span className="menu-name">{item.menu_name}</span>
            </div>

            <button
              className={item.is_reviewed ? "review-done-button" : "review-button"}
              onClick={() => handleReviewClick(item)}
            >
              {item.is_reviewed ? "작성 완료" : "리뷰 작성"}
            </button>
          </div>
        ))}

        {/* ✅ 더보기 버튼 */}
        {visibleCount < history.length && (
          <div className="load-more-wrapper">
            <button className="load-more-button" onClick={handleLoadMore}>
              더보기
            </button>
          </div>
        )}

        <div className="back-button-wrapper">
          <button className="back-button" onClick={() => navigate('/mypage')}>
            ← 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
