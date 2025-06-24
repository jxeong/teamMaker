// src/pages/GroupCreated.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import './GroupCreated.css';
import { useState } from 'react';

export default function GroupCreated() {
  const location = useLocation();
  const navigate = useNavigate();
  const groupCode = location.state?.groupCode || 'no-code';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(groupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group-created-container">
      <div className="progress-bar">
        <div className="filled" />
      </div>
      <h2>내 그룹 생성이 완료되었어요!</h2>
      <p>
        팀을 구성할 구성원들에게 그룹 번호 혹은 링크를 공유해주세요. 
        구성원이 모두 모이면 팀이 생성됩니다.
      </p>

      <div className="info-box">
        <label>내 그룹 찾기 번호</label>
        <div className="code-row">
          <input type="text" value={groupCode} readOnly />
        </div>
      </div>

      <div className="info-box">
        <label>링크로 공유하기</label>
        <input type="text" value={`www.teammaker-${groupCode}`} readOnly />
      </div>

      <button className="share-btn">공유하기</button>
      <button className="status-btn" onClick={() => navigate('/status')}>
        내 그룹 현황 보러가기
      </button>
    </div>
  );
}
