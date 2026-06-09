// src/components/themes/PPTTheme.jsx
import { useState } from 'react';
import Game1 from '../games/Game1';
import Game2 from '../games/Game2';
import HelpModal from '../HelpModal'; // ⭐ 방금 만든 도움말 모달 불러오기

// App.jsx에서 관리하는 전역 상태와 함수들(Props)을 받아옵니다.
export default function PPTTheme({
  headerTitle,
  setHeaderTitle,
  currentModeChange,
  currentGame,
  setCurrentGame,
  triggerImageUpload,
  bgImage,
}) {
  // ==========================================
  // 1. PPT 테마 전용 상태 관리 (Local State)
  // ==========================================

  // 현재 상단 리본 메뉴에서 선택된 탭(홈, 삽입, 디자인 등)을 기억합니다.
  const [activeTab, setActiveTab] = useState('홈');

  // 테마 변경(드롭다운) 메뉴가 열려있는지 여부를 기억합니다.
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  // ⭐ 새로운 로컬 상태 2가지 추가
  const [isEditingTitle, setIsEditingTitle] = useState(false); // 설정(파일 이름 수정) 열림 여부
  const [isHelpOpen, setIsHelpOpen] = useState(false); // 도움말 모달창 열림 여부

  // 현재 화면에 띄워줄 '활성화된 슬라이드 번호'를 기억합니다. (기본값: 1번 슬라이드)
  const [activeSlide, setActiveSlide] = useState(1);

  // 화면 왼쪽에 보여줄 슬라이드 번호 목록입니다. (현재는 고정값 1, 2, 3)
  // 나중에 '새 슬라이드' 기능을 만드실 때 이 배열에 숫자를 추가하시면 됩니다.
  const [slides, setSlides] = useState([1, 2, 3]);

  // 상단 리본 메뉴에 띄워줄 탭 이름들입니다.
  const tabList = [
    '파일',
    '홈',
    '삽입',
    '디자인',
    '전환',
    '애니메이션',
    '슬라이드 쇼',
  ];

  // ==========================================
  // 2. 리본 메뉴 도구 모음 렌더링 함수
  // ==========================================
  // 사용자가 클릭한 탭(activeTab)에 따라 아래쪽 도구 모음 영역의 내용이 바뀝니다.
  const renderRibbonTools = () => {
    switch (activeTab) {
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

      case '삽입':
        return (
          <div className="ribbon-tools">
            {/* 그림 삽입 버튼을 누르면 1번 게임이 켜집니다 (스텔스 게임 트리거) */}
            <button className="tool-btn" onClick={() => setCurrentGame(1)}>
              🖼️<span>그림 삽입</span>
            </button>
            <button className="tool-btn">
              📊<span>차트</span>
            </button>
          </div>
        );

      // 기획하신 PPT/EXCEL 테마 전환 및 사진 업로드를 담당하는 탭입니다 (현재 '페이지 레이아웃' 대신 '디자인' 탭 등에 배치할 수 있습니다. 엑셀과 통일성을 위해 우선 유지했습니다.)
      case '페이지 레이아웃':
      case '디자인': // PPT의 경우 '디자인' 탭에 테마 기능을 넣는 것도 방법입니다.
        return (
          <div className="ribbon-tools">
            {/* 테마 변경 드롭다운 컨테이너 */}
            <div className="dropdown-container">
              <button
                className="tool-btn"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
              >
                🎨<span>테마 ▼</span>
              </button>

              {/* 테마 드롭다운이 열려있을 때만 보이는 메뉴 */}
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

            {/* 버튼 사이의 세로 구분선 */}
            <div
              style={{
                width: '1px',
                height: '40px',
                backgroundColor: '#d2d2d2',
                margin: '0 5px',
              }}
            ></div>

            {/* App.jsx에 있는 진짜 input file 태그를 강제로 클릭하게 만드는 스위치 */}
            <button className="tool-btn" onClick={triggerImageUpload}>
              📷<span>배경</span>
            </button>

            {/* 만약 업로드된 이미지가 있다면, 바로 사진 모드로 넘어갈 수 있는 버튼 노출 */}
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
      case '도움말':
        return (
          <div className="ribbon-tools">
            <button className="tool-btn" onClick={() => setIsHelpOpen(true)}>
              ❓<span>도움말 안내</span>
            </button>
          </div>
        );

      default:
        // 아직 기획되지 않은 탭(홈, 전환, 애니메이션 등)을 눌렀을 때 보여줄 임시 화면입니다.
        return (
          <div className="ribbon-tools">
            <span style={{ fontSize: '12px', color: '#999' }}>
              준비 중인 탭입니다.
            </span>
          </div>
        );
    }
  };

  // ==========================================
  // 3. 메인 PPT 화면 렌더링
  // ==========================================
  return (
    <div className="app-container ppt-theme">
      {/* --- 상단 영역 --- */}
      {/* 🚨 화면 최상단 껍데기에 도움말 모달을 띄우는 조건문 추가 */}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}

      {/* 1. PPT 시그니처 색상의 타이틀바 (가짜 파일명 표시) */}
      <div className="excel-titlebar">{headerTitle} - PowerPoint</div>

      {/* 2. 상단 리본 메뉴 전체 묶음 */}
      <div className="excel-ribbon">
        <div className="ribbon-tabs">
          {tabList.map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`} // 현재 탭이면 글씨 굵게
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        {/* 선택된 탭에 맞는 도구들을 그려주는 함수 실행 */}
        {renderRibbonTools()}
      </div>

      {/* --- 하단 작업 영역 --- */}
      {/* 3. PPT 메인 레이아웃 (좌측 슬라이드 목록 + 우측 캔버스) */}
      <div className="ppt-layout" style={{ position: 'relative' }}>
        {/* 🚨 게임이 켜졌을 때 PPT 화면 위에 투명하게 깔리는 스텔스 레이어 */}
        {currentGame && (
          <div className="stealth-game-layer">
            {currentGame === 1 ? <Game1 /> : <Game2 />}
          </div>
        )}

        {/* ⭐ 좌측 슬라이드 썸네일(미리보기) 사이드바 */}
        <div className="ppt-sidebar">
          {slides.map((slideNum) => (
            <div
              key={`thumb-${slideNum}`}
              // 클릭한 썸네일이 현재 activeSlide와 같으면 테두리에 색깔을 줍니다 (.active CSS 적용)
              className={`ppt-thumbnail ${
                activeSlide === slideNum ? 'active' : ''
              }`}
              // 썸네일을 클릭하면 해당 번호로 activeSlide 상태를 변경하여 페이지를 이동시킵니다.
              onClick={() => setActiveSlide(slideNum)}
            >
              {slideNum}
            </div>
          ))}
        </div>

        {/* ⭐ 우측 메인 슬라이드 캔버스 영역 */}
        <div className="ppt-canvas">
          {/* [핵심 로직]
            모든 슬라이드(1, 2, 3번)를 반복문으로 미리 다 HTML에 그려놓습니다.
            하지만 CSS의 'display' 속성을 사용해서, 현재 activeSlide와 번호가 일치하는 단 1개의 슬라이드만 'flex'로 화면에 보여줍니다.
            나머지 슬라이드들은 'none'으로 숨겨지기 때문에, 다른 페이지를 다녀와도 적어둔 텍스트가 삭제되지 않고 그대로 유지됩니다.
          */}
          {slides.map((slideNum) => (
            <div
              key={`slide-${slideNum}`}
              className="ppt-slide"
              // 현재 클릭된 페이지 번호만 화면에 보여주고, 나머지는 숨깁니다.
              style={{ display: activeSlide === slideNum ? 'flex' : 'none' }}
            >
              {/* 진짜 PPT처럼 글씨를 클릭해서 수정할 수 있는(contentEditable) 박스들입니다. */}
              <div
                className="ppt-title-box"
                contentEditable={true}
                suppressContentEditableWarning={true}
              >
                {slideNum}번 슬라이드 제목을 입력하십시오.
              </div>
              <div
                className="ppt-sub-box"
                contentEditable={true}
                suppressContentEditableWarning={true}
              >
                부제목을 입력하려면 클릭하십시오.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
