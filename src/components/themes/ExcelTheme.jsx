// src/components/themes/ExcelTheme.jsx
import { useState } from 'react';
import HelpModal from '../HelpModal'; // ⭐ 방금 만든 도움말 모달 불러오기

// 테마 파일 최상단에 앞으로 만들 10개의 게임을 모두 import 해둡니다.
// 테마 파일 최상단 수정
import Game1 from '../games/Game1';
import Game2 from '../games/Game2';
import Game3 from '../games/Game3';
import Game4 from '../games/Game4';
import Game5 from '../games/Game5';
import Game6 from '../games/Game6';
import Game7 from '../games/Game7';
import Game8 from '../games/Game8';
import Game9 from '../games/Game9';
import Game10 from '../games/Game10';

// App.jsx에서 넘겨준 데이터(Props)들을 받아옵니다.
export default function ExcelTheme({
  headerTitle,
  setHeaderTitle,
  currentModeChange,
  currentGame,
  setCurrentGame,
  triggerImageUpload,
  bgImage,
}) {
  // 렌더링을 도와주는 함수를 컴포넌트 안에 하나 만들어 줍니다.
  const renderActiveGame = () => {
    switch (currentGame) {
      case 1:
        return <Game1 />;
      case 2:
        return <Game2 />;
      case 3:
        return <Game3 />;
      case 4:
        return <Game4 />;
      case 5:
        return <Game5 />;
      case 6:
        return <Game6 />;
      case 7:
        return <Game7 />;
      case 8:
        return <Game8 />;
      case 9:
        return <Game9 />;
      case 10:
        return <Game10 />;
      default:
        return null;
    }
  };
  const cols = 26; // A열 ~ Z열
  const rows = 50; // 1행 ~ 50행

  // 엑셀 테마 안에서만 사용하는 지역 상태(Local State)
  const [activeTab, setActiveTab] = useState('홈');
  const [isThemeOpen, setIsThemeOpen] = useState(false); // 드롭다운 메뉴 열림/닫힘 상태

  // ⭐ 새로운 로컬 상태 2가지 추가
  const [isEditingTitle, setIsEditingTitle] = useState(false); // 설정(파일 이름 수정) 열림 여부
  const [isHelpOpen, setIsHelpOpen] = useState(false); // 도움말 모달창 열림 여부

  // 기획하신 리본 메뉴 탭 리스트 (파워포인트와 동일하게 구성)
  const tabList = [
    '파일',
    '홈',
    '삽입',
    '페이지 레이아웃',
    '수식',
    '데이터',
    '검토',
    '보기',
    '도움말',
  ];

  // 선택된 탭에 따라 리본 메뉴 버튼들을 그려주는 함수
  const renderRibbonTools = () => {
    switch (activeTab) {
      // ⭐ 파일 탭: '설정' 클릭 시 이름 수정 인풋 박스가 나타납니다.
      case '파일':
        return (
          <div className="ribbon-tools">
            <button
              className="tool-btn"
              onClick={() => setIsEditingTitle(!isEditingTitle)}
            >
              ⚙️<span>설정</span>
            </button>

            {/* 설정 버튼을 누르면 옆에 글씨 수정 칸이 나타납니다 */}
            {isEditingTitle && (
              <>
                <div
                  style={{
                    width: '1px',
                    height: '40px',
                    backgroundColor: '#d2d2d2',
                    margin: '0 10px',
                  }}
                ></div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#666' }}>
                    파일 이름 수정 (브라우저 탭 이름도 바뀜)
                  </span>
                  <input
                    type="text"
                    className="title-edit-input"
                    value={headerTitle}
                    onChange={(e) => setHeaderTitle(e.target.value)} // 글씨를 쓸 때마다 즉각 반영!
                    placeholder="예: 2026년도 상반기 결산"
                  />
                </div>
              </>
            )}
          </div>
        );

      case '페이지 레이아웃': // 핵심: 테마 변경 및 배경 사진 스위치
        return (
          <div className="ribbon-tools">
            {/* 테마 드롭다운 컨테이너 */}
            <div className="dropdown-container">
              <button
                className="tool-btn"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
              >
                🎨<span>테마 ▼</span>
              </button>
              {isThemeOpen && (
                <div className="theme-dropdown">
                  <div
                    className="theme-option"
                    onClick={() => currentModeChange('EXCEL')}
                  >
                    🟩 Excel 테마
                  </div>
                  <div
                    className="theme-option"
                    onClick={() => currentModeChange('PPT')}
                  >
                    🟧 PPT 테마
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                width: '1px',
                height: '40px',
                backgroundColor: '#d2d2d2',
                margin: '0 5px',
              }}
            ></div>

            {/* App.jsx에 있는 숨겨진 input을 클릭하게 만드는 버튼 */}
            <button className="tool-btn" onClick={triggerImageUpload}>
              📷<span>배경</span>
            </button>

            {/* 업로드된 사진이 있으면 다시 띄울 수 있는 버튼 */}
            {bgImage && (
              <button
                className="tool-btn"
                onClick={() => currentModeChange('PHOTO')}
              >
                🖼️<span>등록된 사진</span>
              </button>
            )}
          </div>
        );

      // ⭐ 도움말 탭: 클릭 시 모달창 열림 상태를 true로 변경합니다.
      case '도움말':
        return (
          <div className="ribbon-tools">
            <button className="tool-btn" onClick={() => setIsHelpOpen(true)}>
              ❓<span>도움말 안내</span>
            </button>
          </div>
        );

      default:
        return (
          <div className="ribbon-tools">
            <span style={{ fontSize: '12px', color: '#999' }}>
              준비 중인 탭입니다.
            </span>
          </div>
        );
    }
  };

  return (
    // 엑셀 테마 전용 CSS 클래스(excel-theme) 적용
    <div className="app-container excel-theme">
      {/* 🚨 화면 최상단 껍데기에 도움말 모달을 띄우는 조건문 추가 */}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
      {/* 1. 초록색 타이틀바 */}
      <div className="excel-titlebar">{headerTitle} - Excel</div>

      {/* 2. 엑셀 리본 메뉴 */}
      <div className="excel-ribbon">
        <div className="ribbon-tabs">
          {tabList.map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        {renderRibbonTools()}
      </div>

      {/* 3. 엑셀 전용 수식 입력줄 */}
      <div className="excel-formula">fx</div>

      {/* 4. 작업 영역 및 스텔스 게임 레이어 */}
      <div className="workspace-area" style={{ position: 'relative' }}>
        {currentGame && (
          <div
            className="stealth-game-layer"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            {/* 위에서 만든 함수를 여기서 실행해 알맞은 게임을 띄웁니다! */}
            {renderActiveGame()}
          </div>
        )}

        {/* 엑셀 바둑판 그리드 그리기 */}
        <div className="excel-grid">
          <div className="cell header"></div>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={`col-${i}`} className="cell header">
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div style={{ display: 'contents' }} key={`row-${rowIndex}`}>
              <div className="cell header">{rowIndex + 1}</div>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="cell data-cell"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
