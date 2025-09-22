import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './ManageGroup.css';

export default function ManageGroup() {
  const navigate = useNavigate();
  const [groupCode, setGroupCode] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [students, setStudents] = useState([]);
  const [group, setGroup] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8080/api/group/auth', {
        groupCode,
        password,
      });

      if (res.data.authenticated) {
        setIsAuthenticated(true);
        setErrorMessage('');

       const [groupRes, countRes, studentsRes] = await Promise.all([
                 axios.get(`http://localhost:8080/api/group/info/${groupCode}`),
                 axios.get(`http://localhost:8080/api/student/count/${groupCode}`),
                 axios.get(`http://localhost:8080/api/student/list/${groupCode}`),
               ]);

        setGroup(groupRes.data);
        setParticipantCount(countRes.data);
        setStudents(studentsRes.data);
      } else {
        setErrorMessage('그룹 코드 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="manage-group-container">
      {!isAuthenticated ? (
        <form onSubmit={handleAuthSubmit} className="auth-form">
          <h2>내가 만든 그룹 관리</h2>
          <label>그룹 코드</label>
          <input
            type="text"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            required
          />

          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit">접속하기</button>
          <button onClick={() => navigate(-1)}>돌아가기</button>
        </form>
      ) : (
        <div className="student-list-section">

          {group && (
                      <>
                        <h2>{group.courseName} 참여 학생 목록</h2>
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
                          <p className="complete-message">모든 팀원 정보 입력 완료!
                            <br />팀 구성이 가능합니다.
                          </p>
                        )}
                      </>
                    )}
                    <div className="button-groups">
                      <button
                        onClick={() => {
                          if (participantCount === group.totalStudents) {
                            navigate('/team-maker', {
                              state: {
                                groupCode: groupCode,  // 팀 구성 페이지에 전달
                              },
                            });
                          } else {
                            alert('아직 모든 팀원의 정보가 입력되지 않았습니다.');
                          }
                        }}
                      >
                        팀 구성하기
                      </button>

                      <button onClick={() => navigate('/')}>메인 페이지로</button>
                    </div>

          <ul className="student-list">
            {students.length === 0 ? (
              <li>아직 등록된 학생이 없습니다.</li>
            ) : (
              students.map((student, index) => (
                <li key={index} className="student-item">
                  <p><strong>이름 | </strong> {student.studentName}</p>
                  <p><strong>전화번호 | </strong> {student.phoneNumber}</p>
                  <p><strong>MBTI | </strong> {student.mbti}</p>
                  <p><strong>팀 역할 | </strong> {student.role_type}</p>
                </li>
              ))
            )}
          </ul>

        </div>
      )}
    </div>
  );
}
