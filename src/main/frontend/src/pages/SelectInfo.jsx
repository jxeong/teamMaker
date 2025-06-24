// src/pages/SelectInfo.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectInfo.css';

const infoList = ['이름', '휴대폰 번호', 'MBTI', '팀 프로젝트 경험', '주소지'];

export default function SelectInfo() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggleItem = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    const groupCode = generateGroupCode();
    navigate('/group-created', { state: { groupCode } });
    // 다음 페이지 이동
  };

  const handleBack = () => {
    navigate(-1); // 뒤로 가기
  };

  // 랜덤 코드 생성 함수 (영문 소문자+숫자 8자리)
  const generateGroupCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };
  

  return (
    <div className="select-info-container">
      <div className="progress-bar">
        <div className="filled" />
      </div>
      <h2>구성원에게 받을 정보 선택</h2>
      <p>프로젝트/수업 구성원들에게 받을 정보를 선택해주세요.<br />해당 정보를 바탕으로 팀이 꾸려집니다.</p>
      
      <div className="info-list">
        {infoList.map((item) => (
          <div
            key={item}
            className={`info-item ${selected.includes(item) ? 'selected' : ''}`}
            onClick={() => toggleItem(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="button-group">
        <button className="back-btn" onClick={handleBack}>이전</button>
        <button className="next-btn" onClick={handleNext}>다음</button>
      </div>
    </div>
  );
}
