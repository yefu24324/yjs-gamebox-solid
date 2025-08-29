import { createSignal, For } from "solid-js";
import { MotionEffect } from "~/components/animate-ui/effects/motion-effect";
import { ChessPiece } from "./chess-piece";
import { useChineseChessContext } from "./chinese-chess-context";
import { BOARD_HEIGHT, BOARD_WIDTH, GRID_SIZE } from "./constant";
import type { ChessPieceData, Position } from "./types";

// 棋盘组件
export function ChessBoard() {
  const { yChessPieceMap, chessPieces, movePiece, selectionPiece } = useChineseChessContext();

  const [gameBoxDiv, setGameBoxDiv] = createSignal<HTMLDivElement>();

  const onPieceClick = (piece: ChessPieceData) => {
    selectionPiece.set(piece);
  };

  return (
    <div class="bg-card from-amber-100 to-amber-200 p-6 rounded-xl shadow-2xl border-4 border-amber-800">
      <div
        class="relative chess-board"
        ref={setGameBoxDiv}
        style={{
          height: `${BOARD_HEIGHT}px`,
          width: `${BOARD_WIDTH}px`,
        }}
      >
        {/* 绘制棋盘网格线 */}
        <svg class="absolute inset-0" height={BOARD_HEIGHT} style="pointer-events: none;" width={BOARD_WIDTH}>
          {/* 横线 */}
          {Array.from({ length: 10 }).map((_, y) => (
            <line stroke="#8B4513" stroke-width="2" x1="32" x2={32 + 8 * GRID_SIZE} y1={32 + y * GRID_SIZE} y2={32 + y * GRID_SIZE} />
          ))}

          {/* 竖线 */}
          {Array.from({ length: 9 }).map((_, x) => (
            <>
              {/* 上半部分竖线 (0-4行) */}
              <line stroke="#8B4513" stroke-width="2" x1={32 + x * GRID_SIZE} x2={32 + x * GRID_SIZE} y1="32" y2={32 + 4 * GRID_SIZE} />
              {/* 下半部分竖线 (5-9行) */}
              <line stroke="#8B4513" stroke-width="2" x1={32 + x * GRID_SIZE} x2={32 + x * GRID_SIZE} y1={32 + 5 * GRID_SIZE} y2={32 + 9 * GRID_SIZE} />
            </>
          ))}

          {/* 九宫格对角线 - 上方 */}
          <line stroke="#8B4513" stroke-width="2" x1={32 + 3 * GRID_SIZE} x2={32 + 5 * GRID_SIZE} y1="32" y2={32 + 2 * GRID_SIZE} />
          <line stroke="#8B4513" stroke-width="2" x1={32 + 5 * GRID_SIZE} x2={32 + 3 * GRID_SIZE} y1="32" y2={32 + 2 * GRID_SIZE} />

          {/* 九宫格对角线 - 下方 */}
          <line stroke="#8B4513" stroke-width="2" x1={32 + 3 * GRID_SIZE} x2={32 + 5 * GRID_SIZE} y1={32 + 7 * GRID_SIZE} y2={32 + 9 * GRID_SIZE} />
          <line stroke="#8B4513" stroke-width="2" x1={32 + 5 * GRID_SIZE} x2={32 + 3 * GRID_SIZE} y1={32 + 7 * GRID_SIZE} y2={32 + 9 * GRID_SIZE} />

          {/* 河界标识 */}
          <text fill="#8B4513" font-size="16" font-weight="bold" text-anchor="middle" x={32 + 1 * GRID_SIZE} y={32 + 4.7 * GRID_SIZE}>
            楚河
          </text>
          <text fill="#8B4513" font-size="16" font-weight="bold" text-anchor="middle" x={32 + 7 * GRID_SIZE} y={32 + 4.7 * GRID_SIZE}>
            汉界
          </text>
        </svg>
        <For each={chessPieces.get()}>
          {(piece, index) => {
            return (
              <MotionEffect
                delay={0.1 + index() * 0.1}
                fade
                slide={{
                  direction: "down",
                }}
                zoom
              >
                <ChessPiece isDragging={false} onClick={() => onPieceClick(piece)} piece={piece} />
              </MotionEffect>
            );
          }}
        </For>
      </div>
    </div>
  );
}

/** 拖拽占位, 在占位上显示圆圈 */
export function ChessDragPlaceholder(props: { dragPosition: Position }) {
  function getLeft() {
    const x = Math.round(props.dragPosition.x / GRID_SIZE);
    return x * GRID_SIZE + 32;
  }

  function getTop() {
    const y = Math.round(props.dragPosition.y / GRID_SIZE);
    return y * GRID_SIZE + 32;
  }
  return (
    <div
      class="absolute w-2 h-2 rounded-full bg-red-500/50 pointer-events-none"
      style={{
        left: `${getLeft()}px`,
        top: `${getTop()}px`,
      }}
    />
  );
}
