import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupStatusEnter.css';

export default function GroupStatusEnter() {
  const [groupCode, setGroupCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupCode.trim() === '') {
      alert('그룹 코드를 입력해주세요.');
      return;
    }

    navigate('/status/result', { state: { groupCode } });
  };

  return (
    <div className="status-page">
    <div className='status-content'>
      <h2>그룹 코드를 입력하면 현재 현황을 확인할 수 있어요.</h2>
      <form onSubmit={handleSubmit}>
        <label>그룹 코드</label>
        <input
          type="text"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
          placeholder="예: a1b2c3d4"
          required
        />
        <div className="btn-row">
          <button type="button" onClick={() => navigate('/')}>취소</button>
          <button type="submit">다음</button>
        </div>
      </form>
    </div>
    </div>
  );
}
