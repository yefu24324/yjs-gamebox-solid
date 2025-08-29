import { Show } from "solid-js";
import { Motion } from "solid-motion";
import { cn } from "~/libs/cn";
import { useChineseChessContext } from "./chinese-chess-context";
import type { ChessPieceData } from "./types";

export interface ChessPieceProps {
  piece: ChessPieceData;
  isDragging?: boolean;
  dragPosition?: { x: number; y: number };
  onClick: (event: MouseEvent) => void;
}
/**
 * 棋子组件
 */
export function ChessPiece(props: ChessPieceProps) {
  const chessContext = useChineseChessContext();
  const GRID_SIZE = 64;

  function getLeft() {
    return props.piece.position.x * GRID_SIZE;
  }

  function getTop() {
    return props.piece.position.y * GRID_SIZE;
  }

  return (
    <div
      class={cn(
        "absolute w-16 h-16 rounded-full shadow-sm border flex items-center justify-center bg-white/95 select-none",
        props.isDragging ? "z-50 scale-110 shadow-lg transition-none" : "transition-all duration-200 hover:scale-110",
      )}
      onClick={props.onClick}
      style={{
        left: `${getLeft()}px`,
        top: `${getTop()}px`,
        transform: props.isDragging ? "none" : undefined,
      }}
    >
      <div class={cn("absolute inset-[3px] rounded-full", props.piece.side === "r" ? "border border-red-300" : "border border-stone-300")} />
      <span aria-hidden class={cn("font-bold text-[min(5vw,28px)] leading-none", props.piece.side === "r" ? "text-red-600" : "text-stone-900")}>
        {formatPieceChar(props.piece)}
      </span>
      <span class="sr-only">
        {props.piece.side === "r" ? "红" : "黑"} {formatPieceChar(props.piece)}
      </span>

      <Show when={chessContext.selectionPiece.get()?.id === props.piece.id}>
        <ChessPieceSelectBox piece={props.piece} />
      </Show>
    </div>
  );
}

/** 格式化棋子字符 */
export function formatPieceChar(piece: ChessPieceData) {
  if (piece.side === "r") {
    switch (piece.type) {
      case "车":
        return "车";
      case "马":
        return "马";
      case "相":
        return "相";
      case "士":
        return "士";
      case "帅":
        return "帅";
      case "炮":
        return "炮";
      case "兵":
        return "兵";
    }
  } else {
    switch (piece.type) {
      case "车":
        return "車";
      case "马":
        return "馬";
      case "相":
        return "象";
      case "士":
        return "仕";
      case "帅":
        return "將";
      case "炮":
        return "砲";
      case "兵":
        return "卒";
    }
  }
}

/** 棋子选中框 */
export function ChessPieceSelectBox(props: { piece: ChessPieceData }) {
  const GRID_SIZE = 64;

  return (
    <Motion
      animate={{
        scale: [1, 1.2, 1],
      }}
      class="absolute pointer-events-none"
      style={{
        height: `${GRID_SIZE + 8}px`,
        left: `-4px`,
        top: `-4px`,
        width: `${GRID_SIZE + 8}px`,
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.2,
      }}
    >
      {/* 左上角 */}
      <div class="absolute top-0 left-0 w-4 h-4">
        <div class="absolute top-0 left-0 w-4 h-0.5 bg-yellow-400"></div>
        <div class="absolute top-0 left-0 w-0.5 h-4 bg-yellow-400"></div>
      </div>

      {/* 右上角 */}
      <div class="absolute top-0 right-0 w-4 h-4">
        <div class="absolute top-0 right-0 w-4 h-0.5 bg-yellow-400"></div>
        <div class="absolute top-0 right-0 w-0.5 h-4 bg-yellow-400"></div>
      </div>

      {/* 左下角 */}
      <div class="absolute bottom-0 left-0 w-4 h-4">
        <div class="absolute bottom-0 left-0 w-4 h-0.5 bg-yellow-400"></div>
        <div class="absolute bottom-0 left-0 w-0.5 h-4 bg-yellow-400"></div>
      </div>

      {/* 右下角 */}
      <div class="absolute bottom-0 right-0 w-4 h-4">
        <div class="absolute bottom-0 right-0 w-4 h-0.5 bg-yellow-400"></div>
        <div class="absolute bottom-0 right-0 w-0.5 h-4 bg-yellow-400"></div>
      </div>
    </Motion>
  );
}
