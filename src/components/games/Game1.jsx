// src/components/games/Game1.jsx
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Game1() {
  // ==========================================
  // 1. 게임 상태 관리 (React State)
  // ==========================================

  // 게임의 현재 진행 상태를 나타냅니다.
  // 'IDLE'(대기창) -> 'PLAYING'(게임중) -> 'GAMEOVER'(사망창) 순으로 변합니다.
  const [gameState, setGameState] = useState('IDLE');

  // 우측 상단에 위장용으로 띄워줄 생존 시간(초) 텍스트입니다.
  const [score, setScore] = useState('0.0');

  // ==========================================
  // 2. 화면 렌더링 없이 값을 기억하는 변수들 (useRef)
  // ==========================================
  // ❗ React의 useState를 쓰면 값이 바뀔 때마다 화면이 전체 새로고침(Re-render)되어 게임이 끊깁니다.
  // 그래서 좌표나 시간처럼 1초에 60번씩 엄청나게 빠르게 바뀌는 값들은 useRef에 몰래 저장해서 사용합니다.

  const mousePos = useRef({ x: 0, y: 0 }); // 현재 내 마우스 커서의 X, Y 좌표
  const snailPos = useRef({ x: 0, y: 0 }); // 달팽이의 현재 X, Y 좌표
  const startTime = useRef(0); // 게임이 딱 시작된 시간 (밀리초)
  const requestRef = useRef(null); // 브라우저의 애니메이션 프레임 번호 (게임을 멈출 때 필요)

  // HTML <div> 태그(달팽이 이모티콘)를 직접 조종하기 위한 리모컨입니다.
  const snailRef = useRef(null);

  // ==========================================
  // 3. 게임의 심장: 매 프레임(1초에 60번) 실행되는 루프 함수
  // ==========================================
  const updateGame = useCallback(() => {
    // 만약 게임오버 상태거나 대기 상태면 달팽이가 움직이지 않도록 함수를 즉시 종료합니다.
    if (gameState !== 'PLAYING') return;

    // 1️⃣ 경과 시간 계산 (현재 시간 - 시작 시간)
    // Date.now()는 밀리초(1/1000초) 단위이므로 1000으로 나누어 초 단위로 바꿉니다.
    const elapsedSeconds = (Date.now() - startTime.current) / 1000;

    // 소수점 1자리까지만 잘라서 화면(score 상태)에 업데이트합니다.
    setScore(elapsedSeconds.toFixed(1));

    // 2️⃣ ⭐ 핵심 가속도 로직 ⭐
    // 기본 속도를 1.0으로 시작해서, 1초가 지날 때마다 0.15씩 속도가 빨라집니다.
    // 예: 10초 경과 시 속도 2.5 / 20초 경과 시 속도 4.0 (엄청 빠름!)
    const currentSpeed = 1.0 + elapsedSeconds * 0.5;

    // 3️⃣ 마우스와 달팽이 사이의 거리와 각도 계산
    const mx = mousePos.current.x;
    const my = mousePos.current.y;
    const sx = snailPos.current.x;
    const sy = snailPos.current.y;

    const dx = mx - sx; // 가로 거리 차이
    const dy = my - sy; // 세로 거리 차이
    const distance = Math.sqrt(dx * dx + dy * dy); // 피타고라스의 정리로 두 점 사이의 실제 직선 거리를 구합니다.

    // 4️⃣ 💥 충돌(사망) 판정
    // 달팽이와 마우스의 거리가 15픽셀보다 가까워지면 물린 것으로 판정합니다.
    if (distance < 15) {
      setGameState('GAMEOVER'); // 상태를 게임오버로 변경하여 결과창을 띄웁니다.
      cancelAnimationFrame(requestRef.current); // 달팽이의 움직임(루프)을 완전히 정지시킵니다.
      return;
    }

    // 5️⃣ 달팽이 이동 로직
    // 거리가 0보다 크면(아직 안 닿았으면), 마우스가 있는 방향(각도)으로 계산된 속도만큼 다가갑니다.
    if (distance > 0) {
      snailPos.current.x += (dx / distance) * currentSpeed;
      snailPos.current.y += (dy / distance) * currentSpeed;
    }

    // 6️⃣ 달팽이 위치를 화면에 적용 (CSS Transform)
    // 리액트 상태 변경 없이 DOM을 직접 건드리기 때문에 버벅임 없이 극도로 부드럽게 움직입니다.
    if (snailRef.current) {
      snailRef.current.style.transform = `translate(${snailPos.current.x}px, ${snailPos.current.y}px)`;
    }

    // 7️⃣ 브라우저에게 "다음 프레임(화면) 그릴 때 이 함수 또 실행해줘!" 라고 예약합니다. (무한 반복)
    requestRef.current = requestAnimationFrame(updateGame);
  }, [gameState]);

  // ==========================================
  // 4. 사용자 조작 감지 (이벤트 핸들러)
  // ==========================================

  // 마우스를 움직일 때마다 현재 마우스 위치를 실시간으로 저장하는 함수
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect(); // 게임 화면의 테두리 정보를 가져옵니다.
    // 화면 맨 왼쪽/맨 위를 기준으로 마우스가 몇 픽셀 떨어져 있는지 계산해 저장합니다.
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // 게임을 처음 시작하거나, 죽고 나서 다시 시작할 때 부르는 함수
  const startGame = () => {
    if (gameState === 'PLAYING') return; // 이미 게임 중이면 아무 일도 안 함

    // 달팽이를 항상 화면 정중앙에 소환합니다. (어느 방향으로 마우스를 피해야 할지 긴장감 부여)
    snailPos.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    startTime.current = Date.now(); // 타이머 0초 시작
    setScore('0.0'); // 화면 점수 초기화
    setGameState('PLAYING'); // 상태를 '게임중'으로 변경 (이때 달팽이가 화면에 나타남)
  };

  // gameState가 'PLAYING'으로 변하는 순간, 위에서 만든 updateGame(추격 루프)를 발동시키는 스위치
  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    // 창을 닫거나 게임오버가 되면 남은 애니메이션 예약을 취소하여 메모리 누수를 막습니다.
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, updateGame]);

  // ==========================================
  // 5. 화면 렌더링 (HTML & CSS)
  // ==========================================
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: gameState === 'PLAYING' ? 'crosshair' : 'default', // 게임 중엔 마우스 커서를 '+' 모양으로 바꿔 위장
        overflow: 'hidden', // 달팽이가 화면 밖으로 나갔을 때 스크롤바가 생기는 것을 방지
      }}
      onMouseMove={handleMouseMove} // 마우스가 움직일 때마다 위치 추적
      onClick={startGame} // 배경 아무 곳이나 클릭하면 게임 시작
    >
      {/* 🔴 대기 화면 (업무용 데이터 동기화 팝업인 척 위장) */}
      {gameState === 'IDLE' && (
        <div style={stealthPopupStyle}>
          <p style={{ fontWeight: 'bold', color: '#333' }}>
            데이터 동기화 준비 완료
          </p>
          <p style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
            마우스 트래킹을 통해 데이터를 실시간으로 동기화합니다.
            <br />
            화면을 클릭하여 세션을 시작하십시오.
          </p>
        </div>
      )}

      {/* 🔴 게임 오버 화면 (서버 에러 창인 척 위장) */}
      {gameState === 'GAMEOVER' && (
        <div style={stealthPopupStyle}>
          <p style={{ fontWeight: 'bold', color: '#b7472a' }}>
            ⚠ 동기화 세션 종료 (충돌 감지)
          </p>
          <p style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
            유지된 세션 시간:{' '}
            <strong style={{ color: '#333' }}>{score}초</strong>
          </p>
          <p
            style={{
              marginTop: '5px',
              fontSize: '11px',
              color: '#107c41',
              cursor: 'pointer',
            }}
          >
            [화면을 클릭하여 재연결 시도]
          </p>
        </div>
      )}

      {/* 🟢 실제 게임 진행 화면 */}
      {gameState === 'PLAYING' && (
        <>
          {/* 우측 상단에 작게 띄워두는 생존 시간 (디테일: 세션 유지 시간인 것처럼 위장) */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              fontSize: '11px',
              color: '#999',
            }}
          >
            세션 유지: {score}s
          </div>

          {/* 🐌 플레이어를 추격하는 달팽이 (사실은 단순한 텍스트 <div>) */}
          <div
            ref={snailRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              fontSize: '14px',
              userSelect: 'none', // 달팽이를 마우스로 드래그해서 블록 지정하는 것을 방지
              transform: 'translate(-100px, -100px)', // 초기 위치는 안 보이게 밖으로 빼둠
              // 마우스 커서의 끝부분과 이모티콘의 정중앙이 정확히 일치하도록 위치 미세 조정
              marginLeft: '-7px',
              marginTop: '-7px',
            }}
          >
            🐌
          </div>
        </>
      )}
    </div>
  );
}

// ==========================================
// 6. 위장용 팝업창 디자인 (CSS 객체)
// ==========================================
const stealthPopupStyle = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)', // 화면 정중앙에 정확히 배치하는 마법의 CSS
  backgroundColor: '#fff',
  border: '1px solid #c8c8c8',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '20px 30px',
  fontFamily: '"Malgun Gothic", sans-serif',
  fontSize: '12px',
  textAlign: 'center',
  zIndex: 100, // 가장 위로 올라오게 설정
};
