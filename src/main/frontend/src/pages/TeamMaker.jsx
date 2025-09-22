import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './TeamMaker.css';

export default function TeamMaker() {
  const location = useLocation();
  const { groupCode } = location.state;
  const navigate = useNavigate();
  const [groupInfo, setGroupInfo] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [teamResult, setTeamResult] = useState(null);  // 팀 결과 저장

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupRes, studentsRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/group/info/${groupCode}`),
          axios.get(`http://localhost:8080/api/student/list/${groupCode}`),
        ]);

        setGroupInfo(groupRes.data);
        setStudentList(studentsRes.data);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchData();
  }, [groupCode]);

  // 팀 구성 요청
  const handleTeamMaking = async () => {
    if (!groupInfo || studentList.length === 0) {
      alert('팀 구성에 필요한 데이터가 부족합니다.');
      return;
    }

    const requestData = {
      groupCode: groupCode,
      courseName: groupInfo.courseName,
      totalStudents: groupInfo.totalStudents,
      studentsPerTeam: groupInfo.studentsPerTeam,
      students: studentList.map((s) => ({
        studentName: s.studentName,
        mbti: s.mbti,
        role_type: s.role_type
      }))
    };

    console.log('FastAPI로 보낼 JSON:', JSON.stringify(requestData, null, 2));

    try {
      const res = await axios.post('http://localhost:8000/cluster/make-teams', requestData);
      setTeamResult(res.data.teams);
      alert('팀 구성 완료!');
      navigate('/team-result', { state: { groupCode, teams: res.data.teams } });
    } catch (err) {
      console.error('팀 구성 실패:', err);
      alert('팀 구성 중 오류가 발생했습니다.');

      // 실패하더라도 에러 메시지와 함께 이동
      navigate('/team-result', { state: { groupCode, teams: null, error: '팀 구성 중 오류가 발생했습니다.' } });
    }
  };

  return (
      <div className="team-maker-container">
        <h2>팀 구성 도우미</h2>
        {groupInfo && (
            <>
              <p>과목명: {groupInfo.courseName}</p>
              <p>총 인원: {groupInfo.totalStudents}</p>
              <p>팀당 인원: {groupInfo.studentsPerTeam}</p>
            </>
        )}

        <h3>학생 목록</h3>
        <ul>
          {studentList.map((s, i) => (
              <li key={i}>
                {s.studentName} - {s.mbti} - {s.role_type}
              </li>
          ))}
        </ul>

        <button onClick={handleTeamMaking}>팀 구성 실행</button>
        <button onClick={() => navigate(-1)}>돌아가기</button>

        {teamResult && (
            <>
              <h3>팀 구성 결과</h3>
              {teamResult.map((team, i) => (
                  <div key={i}>
                    <h4>팀 {i + 1}</h4>
                    <ul>
                      {team.map((member, j) => (
                          <li key={j}>
                            {member.studentName} - {member.mbti} - {member.role_type}
                          </li>
                      ))}
                    </ul>
                  </div>
              ))}
            </>
        )}
      </div>
  );
}
