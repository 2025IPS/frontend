// frontend/src/pages/TeamPickFriendPage.js

import React, { useEffect, useState } from "react";
import "./TeamPickFriendPage.css";
import axios from "axios";

function TeamPickFriendPage() {
  const [users, setUsers] = useState([]);
  const [selectedUsernames, setSelectedUsernames] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/users/all").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const toggleSelect = (username) => {
    setSelectedUsernames((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const handleCreateGroup = () => {
    console.log("선택된 유저:", selectedUsernames);
    // 선택된 유저 리스트를 기반으로 그룹 메뉴 추천 로직 수행
  };

  return (
    <div className="friend-select-container">
      <input type="text" placeholder="친구 검색하기" className="search-bar" />
      <ul className="user-list">
        {users.map((user) => (
          <li
            key={user.id}
            className={`user-item ${
              selectedUsernames.includes(user.username) ? "selected" : ""
            }`}
            onClick={() => toggleSelect(user.username)}
          >
            <img
              src={`/profile/${user.username}.png`} // 유저별 이미지 파일
              alt={user.name}
              className="profile-img"
            />
            <span className="user-name">{user.name}</span>
            <div className="select-circle" />
          </li>
        ))}
      </ul>

      <button className="create-group-btn" onClick={handleCreateGroup}>
        그룹 만들기
      </button>
    </div>
  );
}

export default TeamPickFriendPage;
