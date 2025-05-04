import React from 'react';
import './RegisterPage.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <h1 className="register-title">회원정보를 입력해주세요</h1>

      <input type="text" placeholder="ID" className="input-box" />
      <input type="password" placeholder="비밀번호" className="input-box" />
      <input type="password" placeholder="비밀번호 재확인" className="input-box" />
      <input type="text" placeholder="이름" className="input-box" />
      <input type="text" placeholder="휴대폰 번호" className="input-box" />
      <input type="email" placeholder="이메일" className="input-box" />

      <div className="button-group">
        <button 
          className="back-button" 
          type="button" 
          onClick={() => navigate("/")}
        >
          뒤로가기
        </button>
        <button 
          className="next-button" 
          type="button" 
          onClick={() => navigate("/allergy")}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
