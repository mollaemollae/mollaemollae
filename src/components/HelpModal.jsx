// src/components/HelpModal.jsx

export default function HelpModal({ onClose }) {
  return (
    // 배경을 클릭하면 모달창이 닫히도록 설정
    <div className="help-modal-overlay" onClick={onClose}>
      {/* 모달창 내부(흰 박스)를 클릭했을 때는 안 닫히도록 이벤트 전파 차단 */}
      <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 모달 상단 헤더 */}
        <div className="help-modal-header">
          <span>❓ 몰컴 웹사이트 사용 설명서</span>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* 상세 설명서 내용 (스크롤이 생기도록 설정) */}
        <div
          className="help-modal-body"
          style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}
        >
          <h3
            style={{
              borderBottom: '2px solid #eaeaea',
              paddingBottom: '5px',
              marginTop: 0,
            }}
          >
            🖱️ 기본 조작 방법
          </h3>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
            * 각 탭을 클릭하여 상세 설명을 확인하세요.
          </p>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>📁 파일 (설정)</summary>
            <div style={contentStyle}>
              현재 띄워진 위장 문서의 <strong>이름을 변경</strong>할 수
              있습니다. 상사가 자주 확인하는 친숙한 문서명으로 바꿔두세요!
            </div>
          </details>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>🏠 홈 (테마)</summary>
            <div style={contentStyle}>
              <strong>페이지 레이아웃 탭</strong>을 클릭하여 Excel, PowerPoint
              등 상황에 가장 알맞은 오피스 테마로 스위칭합니다.
            </div>
          </details>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>🖼️ 삽입 (배경)</summary>
            <div style={contentStyle}>
              내 모니터 화면 스크린샷을 올려 <strong>완벽한 위장 환경</strong>을
              구축할 수 있습니다. 들키지 않기 위한 스텔스 모드의 핵심
              기능입니다.
            </div>
          </details>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>🚨 보기 (긴급 탈출)</summary>
            <div style={contentStyle}>
              상사가 다가올 때 <kbd>0</kbd> 이나 <kbd>ESC</kbd> 를 누르면 실행
              중인 게임이 즉시 종료되고 원래 업무 화면으로 복귀합니다.
            </div>
          </details>

          <br />
          <h3
            style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '5px' }}
          >
            🎮 스텔스 미니 게임
          </h3>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
            숫자키 <kbd>1</kbd> ~ <kbd>9</kbd>를 눌러 게임을 은밀하게
            실행하세요.
          </p>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>
              🐌 Game 1 : 서류 결재 레이스 (살인 달팽이)
            </summary>
            <div style={contentStyle}>
              <ul>
                <li>
                  <strong>실행:</strong> 숫자키 <kbd>1</kbd>
                </li>
                <li>
                  <strong>목표:</strong> 마우스를 따라오는 스텔스 달팽이를 피해
                  최대한 오랫동안 살아남으세요!
                </li>
                {/* 1번 게임의 규칙이 더 있다면 이곳에 추가하시면 됩니다! */}
              </ul>
            </div>
          </details>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>
              ⚾ Game 2 : 데이터 유속 측정 (스텔스 야구)
            </summary>
            <div style={contentStyle}>
              <ul>
                <li>
                  <strong>실행:</strong> 숫자키 <kbd>2</kbd>
                </li>
                <li>
                  <strong>조작 메커니즘 (Aim & Fire):</strong>
                  <ul style={{ marginTop: '5px' }}>
                    <li>
                      <strong>🎯 조준:</strong> 마우스를 중앙 점선{' '}
                      <strong>위</strong>에 두고 좌우로 움직여 배트를
                      이동시킵니다. (정밀 타격을 위한 2:1 감도 적용)
                    </li>
                    <li>
                      <strong>🔒 장전:</strong> 마우스를 점선{' '}
                      <strong>아래</strong>로 내리면 배트가 회색으로 변하며
                      위치가 고정됩니다.
                    </li>
                    <li>
                      <strong>🔥 격발:</strong> 떨어지는 공에 맞춰 마우스를 다시
                      점선 <strong>위</strong>로 올리면 스윙!
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>점수 산정 (최대 1000점):</strong>
                  <br />
                  타이밍(당겨치기/밀어치기)에 따른 비거리 점수와 배트
                  헤드(스윗스팟) 타격에 따른 가산점(최대 2.0배)이 합산됩니다.
                </li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

// 클릭형 아코디언 UI를 예쁘게 꾸며주는 인라인 CSS 스타일
const detailsStyle = {
  marginBottom: '8px',
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
  border: '1px solid #ddd',
};

const summaryStyle = {
  padding: '10px',
  fontWeight: 'bold',
  cursor: 'pointer',
  outline: 'none',
  userSelect: 'none',
  fontSize: '14px',
  color: '#333',
};

const contentStyle = {
  padding: '12px 15px',
  borderTop: '1px solid #ddd',
  fontSize: '13px',
  color: '#555',
  lineHeight: '1.6',
  backgroundColor: '#fff',
};
