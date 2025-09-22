# 🌐 teamMaker
React + Spring Boot + Genetic Algorithm 기반의 **웹 플랫폼 팀 빌더**

## 🎯 프로젝트 개요
- 교수자가 강의 그룹을 개설하면, 학생들이 그룹 코드를 통해 입장하여 **MBTI·팀장 경험·기술 스택 등**을 입력  
- 입력된 데이터를 바탕으로 **유전 알고리즘(Genetic Algorithm)** 최적화 기법을 활용해 가장 균형 잡힌 팀 구성 자동 생성

---

## ✨ 주요 기능
- **자동 팀 편성:** 팀 인원, 팀 수, 리더 배치 등 제약조건 반영
- **데이터 기반 최적화:** 성향(MBTI), 리더십 경험, 기술 스택, 일정 호환성을 고려
- **유전 알고리즘 활용:** 초기 랜덤 팀 편성 → 교차·돌연변이 연산 → 적합도 평가 → 최적 팀 도출
- **웹 기반 사용성:**  
  - 교수자: 대시보드에서 팀 구성 조건 설정, 결과 확인  
  - 학생: 간단한 입력 폼으로 데이터 제출  
- **결과 리포트:** 팀별 구성표, 역할 추천 등 자동 표시  

---

## 🛠️ 기술 스택
- **Frontend:** React
- **Backend:** Spring Boot
- **Algorithm:** Python 기반 Genetic Algorithm 
- **Database:** MySQL  

---

## 🚀 실행 방법
### 1) Backend (Spring Boot)
```bash
cd backend
./gradlew bootRun
```

### 2) Frontend (React)
```bash
npm start
