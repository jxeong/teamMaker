import { useEffect } from 'react';
import AppRouter from './routes/AppRouter';

function App() {
  useEffect(() => {
    function setScreenSize() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setScreenSize(); // 초기 화면 사이즈 설정
    window.addEventListener('resize', setScreenSize); // 윈도우 리사이즈 이벤트 등록

    return () => {
      window.removeEventListener('resize', setScreenSize); // 클린업 (메모리 누수 방지)
    };
  }, []);

  return <AppRouter />;
}

export default App;
