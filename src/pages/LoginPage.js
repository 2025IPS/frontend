import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/login', {
        username: formData.username,
        password: formData.password
      });

      // 로그인 성공 → 로컬 스토리지에 저장
      localStorage.setItem('username', res.data.username);

      alert('로그인 성공!');
      navigate('/home'); // 홈화면으로 이동 (원하면 마이페이지로 바꿔도 됨)
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">로그인</h1>

      <input
        type="text"
        name="username"
        placeholder="아이디"
        className="login-input"
        value={formData.username}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        className="login-input"
        value={formData.password}
        onChange={handleChange}
      />

      {error && <p className="error-message">{error}</p>}

      <div className="login-button-group">
        <button className="login-button" onClick={handleSubmit}>로그인</button>
        <button className="register-button" onClick={() => navigate('/register')}>회원가입</button>
      </div>
    </div>
  );
}

export default LoginPage;
