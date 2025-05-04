import React, { useState } from 'react';
import './RegisterPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const navigate = useNavigate();

  // 사용자 입력 상태 관리
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    email: ''
  });

  // 오류 메시지 상태
  const [errors, setErrors] = useState({});

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    const newErrors = {};

    // 기본 유효성 검사
    if (!formData.username) newErrors.username = '아이디를 입력해주세요';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    if (!formData.name) newErrors.name = '이름을 입력해주세요';

    // 오류가 있으면 상태 업데이트 후 종료
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // 서버에 회원가입 요청
      const response = await axios.post('http://localhost:8000/register', {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      });

      // 성공 시 사용자명을 로컬 스토리지에 저장
      localStorage.setItem('username', formData.username);

      // 알러지 입력 페이지로 이동
      navigate('/allergy');
    } catch (error) {
      console.error('회원가입 오류:', error);

      // 서버 응답 오류 처리
      if (error.response && error.response.data) {
        if (
          error.response.data.detail === 'Username already exists' ||
          error.response.data.detail === 'Username already registered'
        ) {
          setErrors({ ...errors, username: '이미 사용 중인 아이디입니다' });
        } else {
          alert('회원가입 중 오류가 발생했습니다: ' + error.response.data.detail);
        }
      } else {
        alert('서버 연결 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">회원정보를 입력해주세요</h1>

      <div className="input-group">
        <input 
          type="text"
          name="username"
          placeholder="ID"
          className={`input-box ${errors.username ? 'error' : ''}`}
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
      </div>

      <div className="input-group">
        <input 
          type="password"
          name="password"
          placeholder="비밀번호"
          className={`input-box ${errors.password ? 'error' : ''}`}
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
      </div>

      <div className="input-group">
        <input 
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 재확인"
          className={`input-box ${errors.confirmPassword ? 'error' : ''}`}
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
      </div>

      <div className="input-group">
        <input 
          type="text"
          name="name"
          placeholder="이름"
          className={`input-box ${errors.name ? 'error' : ''}`}
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>

      <input 
        type="text"
        name="phone"
        placeholder="휴대폰 번호"
        className="input-box"
        value={formData.phone}
        onChange={handleChange}
      />

      <input 
        type="email"
        name="email"
        placeholder="이메일"
        className="input-box"
        value={formData.email}
        onChange={handleChange}
      />

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
          onClick={handleSubmit}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
