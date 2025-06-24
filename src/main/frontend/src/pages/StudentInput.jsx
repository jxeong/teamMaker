import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentInput.css'; // 스타일링 별도 가능

export default function StudentInput() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: 그룹코드 입력, 2: 학생 정보 입력
  const [groupCode, setGroupCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    phoneNumber: '',
    mbti: '',
    // 교수자가 추가한 항목이 있다면 여기에 더 추가 가능
  });

  const handleGroupCodeSubmit = async (e) => {
      e.preventDefault();
      if (groupCode.trim() === '') {
        alert('그룹 번호를 입력해주세요.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/group/info/${groupCode}`);
        const groupData = response.data;

        setCourseName(groupData.courseName); // 강의명 저장
        setStep(2); // 학생 정보 입력 단계로 넘어감
      } catch (error) {
        console.error('그룹 조회 실패:', error);
        alert('유효하지 않은 그룹 번호입니다.');
      }
    };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo({
      ...studentInfo,
      [name]: value,
    });
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/student/create', {
        studentName: studentInfo.name,
        phoneNumber: studentInfo.phoneNumber,
        mbti: studentInfo.mbti,
        groupCode: groupCode, // 입력했던 그룹코드 같이 전송
      });

      console.log('학생 등록 성공:', response.data);
      navigate('/status'); // 등록 완료 후 그룹 현황 페이지로 이동
    } catch (error) {
      console.error('학생 등록 실패:', error);
      alert('등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="student-input-container">
      {step === 1 ? (
        <form onSubmit={handleGroupCodeSubmit} className="group-code-form">
          <h2>그룹 번호 입력</h2>
          <input
            type="text"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            placeholder="그룹 번호를 입력하세요"
            required
          />
          <button type="submit">다음</button>
        </form>
      ) : (
        <form onSubmit={handleStudentSubmit} className="student-info-form">
          <h2>{courseName} 강의 그룹에 참여한 것을 환영합니다!</h2>

          <label>이름</label>
          <input
            type="text"
            name="name"
            value={studentInfo.name}
            onChange={handleStudentChange}
            placeholder="이름을 입력하세요"
            required
          />

          <label>전화번호</label>
          <input
            type="text"
            name="phoneNumber"
            value={studentInfo.phoneNumber}
            onChange={handleStudentChange}
            placeholder="전화번호를 입력하세요"
            required
          />

          <label>MBTI</label>
          <input
            type="text"
            name="mbti"
            value={studentInfo.mbti}
            onChange={handleStudentChange}
            placeholder="MBTI를 입력하세요 (예: INFP)"
            required
          />

          {/* 필요하면 여기에 추가 입력 항목 */}

          <button type="submit">정보 제출하기</button>
        </form>
      )}
    </div>
  );
}