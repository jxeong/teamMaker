import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './GroupStatusResult.css';

export default function GroupStatusResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const groupCode = state?.groupCode;

  const [group, setGroup] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    if (!groupCode) {
      alert('잘못된 접근입니다.');
      navigate('/status');
      return;
    }

    const fetchData = async () => {
      try {
        const groupRes = await axios.get(`http://localhost:8080/api/group/info/${groupCode}`);
        const groupData = groupRes.data;
        setGroup(groupData);

        const studentRes = await axios.get(`http://localhost:8080/api/student/count/${groupCode}`);
        setParticipantCount(studentRes.data); // 단순 숫자 응답 예상
      } catch (error) {
        alert('그룹 정보를 불러오지 못했습니다.');
        navigate('/status');
      }
    };

    fetchData();
  }, [groupCode, navigate]);

  return (
    <div className="status-page">
      {group && (
        <>
          <h2 className="lecture-result">{group.courseName}</h2>
          <h2>그룹 구성 현황입니다.</h2>
          <p className="creator">그룹 생성자: {group.creatorName}</p>

          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${(participantCount / group.totalStudents) * 100}%`,
                }}
              />
            </div>
            <p>
              총 인원 {group.totalStudents}명 중 {participantCount}명 참여
            </p>
          </div>

          {participantCount === group.totalStudents && (
                <p className="complete-message">모든 팀원 정보 입력이 완료되었습니다.
                <br/> 팀 구성을 기다려주세요!</p>
              )}

{/*           <button onClick={() => navigate('/manage')}>내가 만든 그룹 관리하기</button> */}
          <button onClick={() => navigate('/')}>메인 페이지로 돌아가기</button>
        </>
      )}
    </div>
  );
}
