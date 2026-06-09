// src/components/HelpModal.jsx

export default function HelpModal({ onClose }) {
  return (
    // 배경을 클릭하면 모달창이 닫히도록 설정
    <div className="help-modal-overlay" onClick={onClose}>
      
      {/* 모달창 내부(흰 박스)를 클릭했을 때는 안 닫히도록 이벤트 전파 차단 */}
      <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* 모달 상단 헤더 (제목과 닫기 버튼) */}
        <div className="help-modal-header">
          <span>❓ 몰컴 웹사이트 사용 설명서</span>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>
        
        {/* 상세 설명서 내용 (이곳에 길게 작성하세요!) */}
        <div className="help-modal-body">
          <p><strong>[기본 테마 조작]</strong></p>
          <ul>
            <li><strong>페이지 레이아웃 탭:</strong> Excel, PowerPoint 테마를 스위칭합니다.</li>
            <li><strong>배경 사진:</strong> 내 모니터 화면 스크린샷을 올려 위장할 수 있습니다.</li>
            <li><strong>긴급 탈출:</strong> 사진 모드일 때 <kbd>ESC</kbd> 키를 누르면 이전 오피스 화면으로 즉시 복귀합니다.</li>
          </ul>
          <br/>
          <p><strong>[스텔스 게임 조작]</strong></p>
          <ul>
            <li>숫자키 <kbd>1</kbd> ~ <kbd>9</kbd> 를 누르면 숨겨진 게임이 실행됩니다.</li>
            <li>상사가 다가올 때 <kbd>0</kbd> 이나 <kbd>ESC</kbd> 를 누르면 게임이 종료됩니다.</li>
          </ul>
          <br/>
          <p style={{ color: '#b7472a', fontSize: '12px' }}>* 파일 탭의 '설정'을 눌러 현재 문서의 이름을 변경할 수 있습니다.</p>
        </div>

      </div>
    </div>
  );
}