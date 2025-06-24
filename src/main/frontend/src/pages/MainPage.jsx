// src/pages/MainPage.jsx
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import illustration from '../assets/main-illustration.png';

// back test
// import React, {useEffect, useState} from "react";
// import axios from "axios";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">
      <div className="main-content">
        <p className="subtitle">최적의 프로젝트 팀 구성을 위해,</p>
        <h1 className="title">TeamMaker</h1>
        <img src={illustration} alt="TeamMaker 캐릭터" className="main-image" />
        <button onClick={() => navigate('/create')}>팀 프로젝트를 위한 그룹 생성하기</button>
        <button onClick={() => navigate('/input')}>생성된 그룹에 내 정보 입력하기</button>
        <button onClick={() => navigate('/status')}>그룹 현황 보러가기</button>
      </div>
      {/*<p>{data}</p>  이렇게 수정: 받아온 data 출력 */}
    </div>
  );
}
