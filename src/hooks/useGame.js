import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
    [0, 4, 8], [2, 4, 6],            // diagonales
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function useGame(playerSymbol) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameId, setGameId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);

  const createNewGame = async () => {
    const { data, error } = await supabase
      .from('games')
      .insert({
        board: Array(9).fill(null),
        current_player: 'X',
        winner: null
      })
      .select()
      .single();

    if (error) throw error;

    setGameId(data.id);
    setBoard(data.board);
    setWinner(data.winner);
    setIsMyTurn(playerSymbol === data.current_player);
  };

  const loadGame = async (id) => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    setGameId(data.id);
    setBoard(data.board);
    setWinner(data.winner);
    setIsMyTurn(playerSymbol === data.current_player);
  };

  const playMove = async (index) => {
    if (!gameId || board[index] || winner || !isMyTurn) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;

    const newWinner = calculateWinner(newBoard);
    const nextPlayer = playerSymbol === 'X' ? 'O' : 'X';

    const { error } = await supabase
      .from('games')
      .update({
        board: newBoard,
        current_player: nextPlayer,
        winner: newWinner
      })
      .eq('id', gameId);

    if (error) throw error;
  };

  const deleteGame = async () => {
    if (!gameId) return;

    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', gameId);

    if (error) console.error('Erreur lors de la suppression de la partie :', error);

    setBoard(Array(9).fill(null));
    setGameId(null);
    setWinner(null);
    setIsMyTurn(false);
  };

  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel('game:' + gameId)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`
      }, payload => {
        const updated = payload.new;
        setBoard(updated.board);
        setWinner(updated.winner);
        setIsMyTurn(updated.current_player === playerSymbol);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, playerSymbol]);

  return {
    board,
    gameId,
    winner,
    isMyTurn,
    createNewGame,
    loadGame,
    playMove,
    deleteGame
  };
}
