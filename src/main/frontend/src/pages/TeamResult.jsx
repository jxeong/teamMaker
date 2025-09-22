import { useLocation, useNavigate } from 'react-router-dom';
import './TeamResult.css';

export default function TeamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupCode, teams } = location.state || {};

  const handleExportCSV = () => {
    if (!teams) return;

    let csvContent = '팀번호,학생명\n';

    teams.forEach((team, teamIdx) => {
      team.forEach((member) => {
        csvContent += `팀 ${teamIdx + 1},${member.studentName}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `team_result_${groupCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (!teams) {
    return (
      <div className="team-result-container">
        <h3>팀 결과가 없습니다.</h3>
        <button onClick={() => navigate(-1)}>돌아가기</button>
      </div>
    );
  }

  return (
    <div className="team-result-container">
      <h2>팀 구성 결과</h2>
      <p>그룹 코드: {groupCode}</p>

      {teams.map((team, idx) => (
        <div key={idx} className="team-box">
          <h3>팀 {idx + 1}</h3>
          <ul>
            {team.map((member, i) => (
              <li key={i}>
                {member.studentName} - {member.mbti} - {member.role_type}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button onClick={() => navigate('/')}>홈으로</button>
      <button onClick={handleExportCSV}>엑셀로 내보내기</button>
    </div>
  );
}
