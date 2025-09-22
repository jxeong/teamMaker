// src/pages/CreateGroup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateGroup.css';
import axios from 'axios';

export default function CreateGroup() {
  const navigate = useNavigate();

  function generateGroupCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) { // 코드 길이 8자리
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    groupName: '',
    totalMembers: '',
    membersPerTeam: '',
    groupCode: generateGroupCode(),
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/group/create', {
        creatorName: form.name,
        creatorEmail: form.email,
        groupPassword: form.password,
        courseName: form.groupName,
        totalStudents: Number(form.totalMembers),
        studentsPerTeam: Number(form.membersPerTeam),
        groupCode: form.groupCode,
      });

      console.log("그룹 생성 성공:", response.data);
      navigate('/group-created', { state: { groupCode: response.data.groupCode } });
    } catch (error) {
      console.error("그룹 생성 실패:", error);
    }
  };

  return (
    <div className="create-group-container">
      <h2>팀 프로젝트를 위한 그룹 생성</h2>
      <form onSubmit={handleSubmit}>
        <label>생성자명</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="이름을 입력하세요"
          required
        />

        <label>이메일</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@gmail.com"
          required
        />

        <label>그룹 비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="내 그룹을 관리할 비밀번호를 입력해주세요."
          required
        />

        <label>수업/프로젝트명</label>
        <input
          type="text"
          name="groupName"
          value={form.groupName}
          onChange={handleChange}
          placeholder="구성원들에게 보여질 그룹 이름입니다."
          required
        />

        <label>전체 인원 수</label>
        <input
          type="number"
          name="totalMembers"
          value={form.totalMembers}
          onChange={handleChange}
          placeholder="프로젝트/수업 전체 인원 수"
          required
        />

        <label>한 팀당 인원 수</label>
        <input
          type="number"
          name="membersPerTeam"
          value={form.membersPerTeam}
          onChange={handleChange}
          placeholder="한 팀당 배정될 인원 수"
          required
        />

        <button type="submit">다음</button>
        <button onClick={() => navigate(-1)}>돌아가기</button>
      </form>
    </div>
  );
}
