// src/components/games/Game2.jsx
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Game2() {
  const [gameState, setGameState] = useState('IDLE');
  const [pitchesLeft, setPitchesLeft] = useState(5);

  // 1. 배트에 뜨는 배수 피드백 (예: x1.8)
  const [batFeedback, setBatFeedback] = useState(null);
  // 2. 공이 도착한 곳에 뜨는 최종 점수 피드백 (예: 50점 x 1.8 = 90점)
  const [scoreFeedback, setScoreFeedback] = useState(null);

  // ==========================================
  // 1. 물리 엔진 및 좌표 변수
  // ==========================================
  const batPos = useRef({ x: 0 });
  const ballPos = useRef({ x: 0, y: 0 });
  const ballVelocity = useRef({ vx: 0, vy: 0, ax: 0 });
  const ballState = useRef('IDLE');
  const totalScore = useRef(0);

  const currentHitMultiplier = useRef(1.0);

  const pitchesLeftRef = useRef(5);
  const isReloaded = useRef(false);

  // 투구 타이밍 조절을 위한 상태 (투수가 공을 쥐고 준비하는 시간)
  const isPreparingPitch = useRef(false);
  const pitchTimeoutRef = useRef(null);

  const swingState = useRef('IDLE');
  const swingStartTime = useRef(0);
  const returnStartTime = useRef(0);
  const triggerLineY = useRef(0);

  const ZONE_WIDTH = 45;
  const SWEET_SPOT_OFFSET = 45;

  const batRef = useRef(null);
  const ballRef = useRef(null);
  const requestRef = useRef(null);
  const containerRef = useRef(null);

  // ==========================================
  // 2. 투구 로직
  // ==========================================
  const throwPitch = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const startX = rect.width / 2;
    const startY = -20;
    const hitY = rect.height - 35;

    const targetX = startX + (Math.random() - 0.5) * ZONE_WIDTH;

    const vy = 7 + Math.random() * 3;
    const totalFrames = (hitY - startY) / vy;

    const ax = (Math.random() - 0.5) * 0.1;
    const distanceX = targetX - startX;
    const vx = (distanceX - 0.5 * ax * Math.pow(totalFrames, 2)) / totalFrames;

    ballPos.current = { x: startX, y: startY };
    ballVelocity.current = { vx: vx, vy: vy, ax: ax };
    ballState.current = 'FALLING';
    currentHitMultiplier.current = 1.0;
  }, []);

  // ==========================================
  // 3. 게임 메인 루프
  // ==========================================
  const updateGame = useCallback(() => {
    if (gameState !== 'PLAYING' || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const hitY = rect.height - 35;

    // 배트 애니메이션
    let batAngleDeg = 15;

    if (swingState.current === 'SWINGING') {
      const elapsed = performance.now() - swingStartTime.current;
      const progress = Math.min(1, elapsed / 120);

      batAngleDeg = 15 - progress * 30;

      if (progress >= 1) {
        swingState.current = 'RETURNING';
        returnStartTime.current = performance.now();
      }
    } else if (swingState.current === 'RETURNING') {
      const elapsed = performance.now() - returnStartTime.current;
      const progress = Math.min(1, elapsed / 250);

      batAngleDeg = -15 + progress * 30;

      if (progress >= 1) {
        swingState.current = 'IDLE';
      }
    }

    if (ballState.current === 'FALLING') {
      ballVelocity.current.vx += ballVelocity.current.ax;
      ballPos.current.x += ballVelocity.current.vx;
      ballPos.current.y += ballVelocity.current.vy;

      // 헛스윙 처리
      if (ballPos.current.y > rect.height + 20) {
        ballState.current = 'IDLE';
        pitchesLeftRef.current -= 1;
        setPitchesLeft(pitchesLeftRef.current);
      }

      // 타격 처리
      if (
        swingState.current === 'SWINGING' &&
        ballPos.current.y > hitY - 12 &&
        ballPos.current.y < hitY + 12
      ) {
        const visualBatCenterX = batPos.current.x + 30;
        const visualHitDistance = Math.abs(
          ballPos.current.x - visualBatCenterX
        );

        if (visualHitDistance < 35) {
          ballState.current = 'HIT';

          const actualSweetSpotX = batPos.current.x + SWEET_SPOT_OFFSET;
          const distFromSweetSpot = Math.abs(
            ballPos.current.x - actualSweetSpotX
          );

          let mult = 2.0 - distFromSweetSpot / 30;
          mult = Math.max(1.0, Math.min(2.0, mult));
          mult = parseFloat(mult.toFixed(1));

          currentHitMultiplier.current = mult;

          // ⭐ 1. 타격 순간 배트 위치에는 '가산점 배수'만 표시
          setBatFeedback({
            text: `x${mult.toFixed(1)}`,
            x: visualBatCenterX,
            y: hitY - 20,
            key: Date.now(),
          });
          setTimeout(() => setBatFeedback(null), 800);

          const elapsed = performance.now() - swingStartTime.current;
          const progress = Math.min(1, elapsed / 120);
          const timingFactor = (0.5 - progress) * 2;

          // 배트에 맞는 위치와 타이밍에 따라 공이 날아가는 속도/각도 결정
          ballVelocity.current.vx =
            timingFactor * 14 + (ballPos.current.x - actualSweetSpotX) * 0.1;
          ballVelocity.current.vy = -18 - (1 - Math.abs(timingFactor)) * 6;
          ballVelocity.current.ax = 0;
        }
      }
    } else if (ballState.current === 'HIT') {
      ballPos.current.x += ballVelocity.current.vx;
      ballPos.current.y += ballVelocity.current.vy;

      // ⭐ 2. 공이 화면 끝(목적지)에 도달했을 때 비로소 진짜 점수를 계산!
      if (
        ballPos.current.y < -30 ||
        ballPos.current.x < -30 ||
        ballPos.current.x > rect.width + 30
      ) {
        let hitX = ballPos.current.x;
        hitX = Math.max(0, Math.min(rect.width, hitX));

        // 최종적으로 화면 중앙 100점 존에서 얼마나 벗어났는가 계산
        const distFromCenter = Math.abs(hitX - centerX);
        let baseScore = Math.floor(100 - (distFromCenter / centerX) * 90);
        baseScore = Math.max(10, baseScore);

        if (ballPos.current.y > 0) baseScore = 10; // 옆면으로 빠진 파울

        const finalScore = Math.floor(baseScore * currentHitMultiplier.current);
        totalScore.current += finalScore;

        // ⭐ 공이 나간 화면 끝 위치에 점수 표시
        let fbX = hitX;
        let fbY = 20; // 기본적으로 화면 맨 위
        if (ballPos.current.y > 0) {
          // 옆면 파울일 경우 표시 위치 조정
          fbY = ballPos.current.y;
          if (ballPos.current.x < 0) fbX = 40;
          if (ballPos.current.x > rect.width) fbX = rect.width - 40;
        }

        setScoreFeedback({
          text: `${baseScore}점 x ${currentHitMultiplier.current.toFixed(
            1
          )} = ${finalScore}점`,
          x: fbX,
          y: fbY,
          key: Date.now(),
        });
        setTimeout(() => setScoreFeedback(null), 1200);

        ballState.current = 'IDLE';
        pitchesLeftRef.current -= 1;
        setPitchesLeft(pitchesLeftRef.current);
      }
    }

    // ----------------------------------------
    // D. 게임 흐름 제어 (투구 딜레이 포함)
    // ----------------------------------------
    if (pitchesLeftRef.current <= 0 && ballState.current === 'IDLE') {
      setGameState('GAMEOVER');
      return;
    }

    // ⭐ 3. 공을 던지기 전에 1.2초 대기 (숨 돌리기)
    if (
      ballState.current === 'IDLE' &&
      pitchesLeftRef.current > 0 &&
      !isPreparingPitch.current
    ) {
      isPreparingPitch.current = true;
      pitchTimeoutRef.current = setTimeout(() => {
        if (gameState === 'PLAYING') {
          throwPitch();
          isPreparingPitch.current = false;
        }
      }, 1200); // 1.2초 후 투구
    }

    // 렌더링
    if (batRef.current) {
      batRef.current.style.transform = `translateX(${batPos.current.x}px) rotate(${batAngleDeg}deg)`;
      if (swingState.current === 'IDLE') {
        batRef.current.style.backgroundColor = isReloaded.current
          ? '#8c8c8c'
          : '#c1c1c1';
      } else {
        batRef.current.style.backgroundColor = '#666';
      }
    }

    if (ballRef.current) {
      ballRef.current.style.transform = `translate(${ballPos.current.x}px, ${ballPos.current.y}px)`;
    }

    requestRef.current = requestAnimationFrame(updateGame);
  }, [gameState, throwPitch]);

  // ==========================================
  // 4. 마우스 조작
  // ==========================================
  const handleMouseMove = (e) => {
    if (gameState !== 'PLAYING' || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (my < triggerLineY.current) {
      if (isReloaded.current) {
        if (swingState.current === 'IDLE') {
          swingState.current = 'SWINGING';
          isReloaded.current = false;
          swingStartTime.current = performance.now();
        }
      } else if (swingState.current === 'IDLE') {
        const centerX = rect.width / 2;
        const mouseOffset = mx - centerX;
        batPos.current.x = centerX + mouseOffset * 0.5 - 30;
      }
    } else {
      if (swingState.current === 'IDLE') {
        isReloaded.current = true;
      }
    }
  };

  const startGame = () => {
    if (gameState === 'PLAYING') return;

    if (containerRef.current) {
      triggerLineY.current = containerRef.current.clientHeight * 0.5;
    }

    clearTimeout(pitchTimeoutRef.current);

    totalScore.current = 0;
    pitchesLeftRef.current = 5;
    setPitchesLeft(5);
    setGameState('PLAYING');
    ballState.current = 'IDLE';
    swingState.current = 'IDLE';
    isReloaded.current = false;
    isPreparingPitch.current = false;
    setBatFeedback(null);
    setScoreFeedback(null);
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      cancelAnimationFrame(requestRef.current);
      clearTimeout(pitchTimeoutRef.current);
    };
  }, [gameState, updateGame]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: gameState === 'PLAYING' ? 'crosshair' : 'default',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onClick={startGame}
    >
      {gameState === 'IDLE' && (
        <div style={stealthPopupStyle}>
          <p style={{ fontWeight: 'bold', color: '#333' }}>
            데이터 유속 측정 도구
          </p>
          <p style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
            5개의 트래픽 패킷을 전송합니다.
            <br />
            하단의 임계선을 넘겨 응답을 수동으로 기록하십시오.
          </p>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <div style={stealthPopupStyle}>
          <p style={{ fontWeight: 'bold', color: '#333' }}>측정 세션 종료</p>
          <div
            style={{
              margin: '15px 0',
              padding: '10px',
              backgroundColor: '#f3f2f1',
              border: '1px solid #e1dfdd',
            }}
          >
            <span style={{ fontSize: '11px', color: '#666' }}>
              데이터 처리량 (타격률):{' '}
            </span>
            <strong style={{ color: '#107c41', fontSize: '16px' }}>
              {totalScore.current} / 1000
            </strong>
          </div>
          <p
            style={{
              marginTop: '5px',
              fontSize: '11px',
              color: '#0078d4',
              cursor: 'pointer',
            }}
          >
            [화면을 클릭하여 재측정 시작]
          </p>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              fontSize: '11px',
              color: '#999',
              zIndex: 10,
            }}
          >
            남은 패킷: {pitchesLeft}
          </div>

          <div
            style={{
              position: 'absolute',
              top: '0px',
              left: '0',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '2px 10px',
              boxSizing: 'border-box',
              fontSize: '10px',
              color: '#b3b3b3',
              userSelect: 'none',
              zIndex: 1,
              backgroundColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <span>10</span>
            <span>50</span>
            <span>80</span>
            <span style={{ fontWeight: 'bold', color: '#777' }}>100</span>
            <span>80</span>
            <span>50</span>
            <span>10</span>
          </div>

          <div
            style={{
              position: 'absolute',
              top: triggerLineY.current,
              left: 0,
              width: '100%',
              borderTop: '1px dotted rgba(0, 0, 0, 0.3)',
              zIndex: 1,
            }}
          ></div>

          {/* ⭐ 타격 순간 배트 위에 뜨는 배수 텍스트 */}
          {batFeedback && (
            <div
              style={{
                position: 'absolute',
                left: batFeedback.x,
                top: batFeedback.y,
                transform: 'translate(-50%, -50%)',
                color: '#8a8886',
                fontWeight: 'bold',
                fontSize: '12px',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                pointerEvents: 'none',
                zIndex: 5,
                animation: 'floatUpAndFade 0.8s ease-out forwards',
              }}
            >
              {batFeedback.text}
            </div>
          )}

          {/* ⭐ 공이 도달한 화면 끝에 뜨는 최종 점수 텍스트 */}
          {scoreFeedback && (
            <div
              style={{
                position: 'absolute',
                left: scoreFeedback.x,
                top: scoreFeedback.y,
                transform: 'translate(-50%, -50%)',
                color: '#777',
                fontWeight: 'bold',
                fontSize: '11px',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                padding: '2px 6px',
                borderRadius: '4px',
                pointerEvents: 'none',
                zIndex: 5,
                animation: 'stayAndFade 1.2s ease-out forwards',
              }}
            >
              {scoreFeedback.text}
            </div>
          )}

          <div
            ref={batRef}
            style={{
              position: 'absolute',
              bottom: '35px',
              left: 0,
              width: '60px',
              height: '10px',
              backgroundColor: '#c1c1c1',
              borderRadius: '5px',
              transformOrigin: 'left center',
              boxShadow: 'inset 0 0 2px rgba(0,0,0,0.1)',
              zIndex: 2,
            }}
          ></div>

          <div
            ref={ballRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '10px',
              height: '10px',
              backgroundColor: '#333',
              border: '2px solid #fff',
              borderRadius: '50%',
              marginLeft: '-5px',
              marginTop: '-5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 3,
            }}
          ></div>

          <style>{`
            @keyframes floatUpAndFade {
              0% { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(1); }
              100% { opacity: 0; transform: translate(-50%, -50%) translateY(-20px) scale(1.2); }
            }
            @keyframes stayAndFade {
              0% { opacity: 0; transform: translate(-50%, -50%) translateY(10px); }
              20% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
              80% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
        </>
      )}
    </div>
  );
}

const stealthPopupStyle = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  border: '1px solid #c8c8c8',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '20px 30px',
  fontFamily: '"Malgun Gothic", sans-serif',
  fontSize: '12px',
  textAlign: 'center',
  zIndex: 100,
};
