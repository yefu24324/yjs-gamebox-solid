import { createSignal } from "solid-js";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { Button } from "~/components/ui/button";
import { toSignalGetSet } from "~/libs/signal-helper";
import { ChessBoard } from "./chess-board";
import { ChineseChessContext, useChineseChessContext } from "./chinese-chess-context";
import type { ChessGameState, ChessPieceData, Position } from "./types";
// 棋子类型定义
export type PieceColor = "red" | "black";

// 游戏状态显示组件
function GameStatus() {
  const { gameState } = useChineseChessContext();

  return (
    <div class="bg-gray-800 text-white p-6 rounded-xl shadow-xl border border-gray-700">
      <h2 class="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">中国象棋</h2>
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-gray-300">当前玩家:</span>
          <span class={`font-bold px-3 py-1 rounded ${gameState().currentPlayer === "r" ? "bg-red-600 text-white" : "bg-gray-700 text-white"}`}>
            {gameState().currentPlayer === "r" ? "红方" : "黑方"}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-300">游戏状态:</span>
          <span class="font-bold text-green-400">
            {gameState().gameStatus === "playing"
              ? "进行中"
              : gameState().gameStatus === "red-win"
                ? "红方胜利"
                : gameState().gameStatus === "black-win"
                  ? "黑方胜利"
                  : "平局"}
          </span>
        </div>
      </div>
    </div>
  );
}

export interface ChineseChessBoxProps {
  roomId: string;
}

export default function ChineseChessBox(props: ChineseChessBoxProps) {
  const doc = new Y.Doc();
  /** 初始化房间 */
  const websocketProvider = new WebsocketProvider(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`, `room/${props.roomId}`, doc);
  const yChessPieceMap = doc.getMap<ChessPieceData>("chessPieces");

  const chessPieces = toSignalGetSet(createSignal<ChessPieceData[]>([]));
  const selectionPiece = toSignalGetSet(createSignal<ChessPieceData | null>(null));
  const [gameState, setGameState] = createSignal<ChessGameState>({
    currentPlayer: "r",
    gameStatus: "playing",
  });

  const [draggedPiece, setDraggedPiece] = createSignal<{ position: Position; piece: ChessPieceData } | null>(null);

  /** 开始游戏：初始游戏状态 */
  function startGame() {
    const initedDataa: ChessPieceData[] = [
      // 红方棋子
      { id: "r-车-0-0", position: { x: 0, y: 0 }, side: "r", type: "车" },
      { id: "r-马-0-1", position: { x: 1, y: 0 }, side: "r", type: "马" },
      { id: "r-相-0-2", position: { x: 2, y: 0 }, side: "r", type: "相" },
      { id: "r-士-0-3", position: { x: 3, y: 0 }, side: "r", type: "士" },
      { id: "r-帅-0-4", position: { x: 4, y: 0 }, side: "r", type: "帅" },
      { id: "r-士-0-5", position: { x: 5, y: 0 }, side: "r", type: "士" },
      { id: "r-相-0-6", position: { x: 6, y: 0 }, side: "r", type: "相" },
      { id: "r-马-0-7", position: { x: 7, y: 0 }, side: "r", type: "马" },
      { id: "r-车-0-8", position: { x: 8, y: 0 }, side: "r", type: "车" },
      { id: "r-炮-2-1", position: { x: 1, y: 2 }, side: "r", type: "炮" },
      { id: "r-炮-2-7", position: { x: 7, y: 2 }, side: "r", type: "炮" },
      { id: "r-兵-3-0", position: { x: 0, y: 3 }, side: "r", type: "兵" },
      { id: "r-兵-3-2", position: { x: 2, y: 3 }, side: "r", type: "兵" },
      { id: "r-兵-3-4", position: { x: 4, y: 3 }, side: "r", type: "兵" },
      { id: "r-兵-3-6", position: { x: 6, y: 3 }, side: "r", type: "兵" },
      { id: "r-兵-3-8", position: { x: 8, y: 3 }, side: "r", type: "兵" },
      // 黑方棋子
      { id: "b-兵-6-0", position: { x: 0, y: 6 }, side: "b", type: "兵" },
      { id: "b-兵-6-2", position: { x: 2, y: 6 }, side: "b", type: "兵" },
      { id: "b-兵-6-4", position: { x: 4, y: 6 }, side: "b", type: "兵" },
      { id: "b-兵-6-6", position: { x: 6, y: 6 }, side: "b", type: "兵" },
      { id: "b-兵-6-8", position: { x: 8, y: 6 }, side: "b", type: "兵" },
      { id: "b-炮-7-1", position: { x: 1, y: 7 }, side: "b", type: "炮" },
      { id: "b-炮-7-7", position: { x: 7, y: 7 }, side: "b", type: "炮" },
      { id: "b-车-9-0", position: { x: 0, y: 9 }, side: "b", type: "车" },
      { id: "b-马-9-1", position: { x: 1, y: 9 }, side: "b", type: "马" },
      { id: "b-相-9-2", position: { x: 2, y: 9 }, side: "b", type: "相" },
      { id: "b-士-9-3", position: { x: 3, y: 9 }, side: "b", type: "士" },
      { id: "b-帅-9-4", position: { x: 4, y: 9 }, side: "b", type: "帅" },
      { id: "b-士-9-5", position: { x: 5, y: 9 }, side: "b", type: "士" },
      { id: "b-相-9-6", position: { x: 6, y: 9 }, side: "b", type: "相" },
      { id: "b-马-9-7", position: { x: 7, y: 9 }, side: "b", type: "马" },
      { id: "b-车-9-8", position: { x: 8, y: 9 }, side: "b", type: "车" },
    ];
    yChessPieceMap.clear();
    initedDataa.forEach((piece) => {
      yChessPieceMap.set(piece.id, piece);
    });
  }

  const movePiece = (from: Position, to: Position) => {
    const currentState = gameState();
    const piece = chessPieces.get().find((p) => p.position.x === from.x && p.position.y === from.y);
    if (!piece) return;

    if (!piece || piece.side !== currentState.currentPlayer) return;

    yChessPieceMap.set(piece.id, { ...piece, position: to });
    selectionPiece.set(null);

    setGameState({
      ...currentState,
      currentPlayer: currentState.currentPlayer === "r" ? "b" : "r",
    });
  };

  const canMoveTo = (from: Position, to: Position): boolean => {
    // 简化版本 - 不实现复杂的走棋规则
    return true;
  };

  function clear() {
    yChessPieceMap.clear();
  }

  yChessPieceMap.observe(() => {
    chessPieces.set(Array.from(yChessPieceMap.values()));
    console.log("Chess pieces updated:", Array.from(yChessPieceMap.values()));
  });

  websocketProvider.on("sync", (isSynced: boolean) => {
    console.log("WebSocket sync status:", isSynced);
    console.log(yChessPieceMap.values());
  });

  return (
    <ChineseChessContext.Provider
      value={{
        canMoveTo,
        chessPieces,
        draggedPiece,
        gameState,
        movePiece,
        selectionPiece,
        setDraggedPiece,
        setGameState,
        yChessPieceMap,
      }}
    >
      <div class="min-h-screen from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div class="flex flex-col lg:flex-row items-center gap-8">
          <div class="flex flex-col">
            <Button onClick={startGame}>开始游戏</Button>
            <Button onClick={clear}>清空</Button>
          </div>
          <ChessBoard />
          <GameStatus />
        </div>
      </div>
    </ChineseChessContext.Provider>
  );
}
