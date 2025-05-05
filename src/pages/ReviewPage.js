import React, { useState } from "react";
import "./ReviewPage.css";

function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState("");

  const tagOptions = ["좋아요", "별로예요", "가성비가 좋아요", "빨리 나와요", "접근성이 좋아요"];

  const handleTagClick = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = () => {
    alert(`리뷰가 저장되었습니다.\n별점: ${rating}\n태그: ${tags.concat(customTag ? [customTag] : []).join(", ")}`);
  };

  return (
    <div className="review-container">
      <h2>리뷰를 작성해주세요</h2>

      <div className="review-place">
        <img src="/food_sample.jpg" alt="추천된 메뉴" className="menu-image" />
        <h3>남영돈</h3>

        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= rating ? "filled" : ""}
              onClick={() => setRating(star)}
            >
              ❤️
            </span>
          ))}
        </div>

        <div className="tags">
          {tagOptions.map((tag) => (
            <span
              key={tag}
              className={tags.includes(tag) ? "selected" : ""}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </span>
          ))}

          <input
            type="text"
            placeholder="커스텀 태그 추가"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
          />
        </div>

        <button className="save-button" onClick={handleSubmit}>
          저장
        </button>
      </div>
    </div>
  );
}

export default ReviewPage;
