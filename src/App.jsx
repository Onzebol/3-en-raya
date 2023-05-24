import confetti from "canvas-confetti"
import { useState } from "react"
import { Square } from "./components/Square"
import { TURNS } from "./constants"
import { WinnerModal } from "./components/WinnerModal"
import { checkEndGame, checkWinner } from "./logic/board"
import { SvgX } from "./components/SvgX"
import { SvgO } from "./components/SvgO"

function App() {
	const [board, setBoard] = useState(() => {
		const boardFromStorage = window.localStorage.getItem('board')
		return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
	})
	const [turn, setTurn] = useState(() => {
		const turnFromStorage = window.localStorage.getItem('turn')
		return turnFromStorage ? turnFromStorage : TURNS.X
	})
	const [winner, setWinner] = useState(null)

	const resetGame = () => {	
		setBoard(Array(9).fill(null))
		setTurn(turn === TURNS.X ? TURNS.O : TURNS.X)
		setWinner(null)

		window.localStorage.removeItem('board')
		window.localStorage.removeItem('turn')
	}

	const updateBoard = (index) => {
		if (board[index] || winner) return

		const newBoard = [... board]
		newBoard[index] = turn
		setBoard(newBoard)

		const newWinner = checkWinner(newBoard)
		if (newWinner) {
			setWinner(newWinner)
			confetti()
		} else if (checkEndGame(newBoard)) {
			setWinner(false)
		} else {
			const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
			setTurn(newTurn)
			window.localStorage.setItem('board', JSON.stringify(newBoard))
			window.localStorage.setItem('turn', newTurn)
		}
	}

	return (
		<main className="board">
			<h1>3 en raya</h1>
			<section className="turn">
				<Square isSelected={turn === TURNS.X}><SvgX /></Square>
				<Square isSelected={turn === TURNS.O}><SvgO /></Square>
			</section>
			<section className="game">
				{
					board.map((square, index) => {
						return (
							<Square 
								key={index}
								index={index}
								updateBoard={updateBoard}
							>
								{square === TURNS.X && <SvgX />}
								{square === TURNS.O && <SvgO />}
							</Square>
						)
					})
				}
			</section>
			
			<button onClick={resetGame}>Reiniciar la partida</button>

			<WinnerModal resetGame={resetGame} winner={winner} />
		</main>
	)
}

export default App
