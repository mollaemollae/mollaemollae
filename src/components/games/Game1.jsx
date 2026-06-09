// src/components/games/Game1.jsx
export default function Game1() {
  return (
    // 게임 전체를 엑셀과 동일한 폰트/색상으로 맞춥니다
    <div
      style={{
        padding: '25px 40px',
        fontFamily: '"Malgun Gothic", sans-serif',
        fontSize: '12px',
        color: '#333',
      }}
    >
      <p style={{ fontWeight: 'bold' }}>
        =IF(상사="접근중", "업무중", "게임중")
      </p>
      <p style={{ marginTop: '10px' }}>
        이곳에 엑셀 데이터인 척 위장한 텍스트 기반 퀘스트나,
      </p>
      <p>
        방향키로 움직이는 셀 색상 채우기(테트리스/지렁이 게임)가 렌더링 됩니다.
      </p>
      <p style={{ marginTop: '20px', color: '#107c41', cursor: 'pointer' }}>
        [▶ 데이터 분석 시작 (클릭)]
      </p>
    </div>
  );
}
