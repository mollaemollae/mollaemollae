// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import './index.css';

// 🎨 분리해 둔 테마 컴포넌트들을 불러옵니다.
import ExcelTheme from './components/themes/ExcelTheme';
import PPTTheme from './components/themes/PPTTheme';

// 🎮 스텔스 모드로 실행될 미니 게임 컴포넌트 (사진 모드에서 쓰기 위해 App.jsx에도 불러옴)
import Game1 from './components/games/Game1';
import Game2 from './components/games/Game2';

function App() {
  // ==========================================
  // 1. 전역 상태 관리 (Global State)
  // ==========================================
  const [currentMode, setCurrentMode] = useState('EXCEL'); // 현재 테마 ('EXCEL' | 'PPT' | 'PHOTO')
  const [prevMode, setPrevMode] = useState('EXCEL'); // 사진 모드 탈출용 백업 테마
  const [bgImage, setBgImage] = useState(null); // 업로드된 배경 사진 URL
  const [headerTitle, setHeaderTitle] = useState('통합 문서1'); // 파일명 (상단 타이틀바 이름)
  const [currentGame, setCurrentGame] = useState(null); // 현재 실행 중인 게임 번호

  // 숨겨진 사진 업로드 <input>을 클릭하기 위한 리모컨(Ref)
  const fileInputRef = useRef(null);

  // ==========================================
  // 2. 전역 키보드 이벤트 (단축키 감지)
  // ==========================================
  useEffect(() => {
    const handleKeyDown = (event) => {
      // 🚫 글씨를 입력 중일 때는 단축키 무시
      if (document.activeElement.contentEditable === 'true') return;

      // 🚨 사진 모드(PHOTO)일 때 ESC 누르면 이전 테마로 복귀
      if (currentMode === 'PHOTO' && event.key === 'Escape') {
        currentModeChange(prevMode);
        return;
      }

      // 🎮 게임 켜기: 숫자 1~9를 누르면 1~9번 게임 실행, 0을 누르면 10번 게임 실행
      if (event.key >= '1' && event.key <= '9') {
        setCurrentGame(Number(event.key));
      } else if (event.key === '0') {
        setCurrentGame(10);
      }
      // 🚨 게임 끄기: 이제 숫자 0으로는 꺼지지 않고 오직 'Escape(ESC)' 키로만 꺼집니다.
      else if (event.key === 'Escape') {
        setCurrentGame(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMode, prevMode]);

  // 브라우저 실제 탭 이름 위장 연동
  useEffect(() => {
    if (currentMode === 'EXCEL') document.title = `${headerTitle} - Excel`;
    else if (currentMode === 'PPT')
      document.title = `${headerTitle} - PowerPoint`;
    else if (currentMode === 'PHOTO') document.title = '바탕 화면';
  }, [currentMode, headerTitle]);

  // ==========================================
  // 3. 전역 동작 함수
  // ==========================================
  const currentModeChange = (mode) => {
    if (currentMode !== 'PHOTO') setPrevMode(currentMode); // 돌아올 곳 저장
    setCurrentMode(mode);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBgImage(URL.createObjectURL(file));
      currentModeChange('PHOTO'); // 업로드 즉시 사진 화면으로 전환
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click(); // 숨겨진 input 강제 클릭
  };

  // ==========================================
  // 4. 메인 렌더링
  // ==========================================

  // 사진 모드(PHOTO)일 경우: 오피스 UI 걷어내고 사진만 전체 화면 렌더링
  if (currentMode === 'PHOTO' && bgImage) {
    return (
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <img src={bgImage} alt="Custom Background" className="full-photo-bg" />
        {/* 사진 뒤에서도 게임 가능 */}
        {currentGame && (
          <div className="stealth-game-layer">
            {currentGame === 1 ? <Game1 /> : <Game2 />}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* 화면엔 안 보이지만 사진 업로드를 담당하는 핵심 태그 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* 현재 테마에 맞는 컴포넌트를 불러오고, 필요한 데이터와 함수를 전달(Props)해 줍니다. */}
      {currentMode === 'EXCEL' && (
        <ExcelTheme
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle} // ⭐ 파일 탭에서 이름을 바꾸기 위해 새로 넘겨주는 함수
          currentModeChange={currentModeChange}
          currentGame={currentGame}
          setCurrentGame={setCurrentGame}
          triggerImageUpload={triggerImageUpload}
          bgImage={bgImage}
        />
      )}

      {currentMode === 'PPT' && (
        <PPTTheme
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle} // ⭐ 파일 탭에서 이름을 바꾸기 위해 새로 넘겨주는 함수
          currentModeChange={currentModeChange}
          currentGame={currentGame}
          setCurrentGame={setCurrentGame}
          triggerImageUpload={triggerImageUpload}
          bgImage={bgImage}
        />
      )}
    </>
  );
}

export default App;
