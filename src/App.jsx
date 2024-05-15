import confetti from "canvas-confetti";
import { useState } from "react";
import { Square } from "./components/Square";
import { TURNS } from "./constants";
import { WinnerModal } from "./components/WinnerModal";
import { checkEndGame, checkWinner } from "./logic/board";
import { SvgX } from "./components/SvgX";
import { SvgO } from "./components/SvgO";

function App() {
	const [board, setBoard] = useState(() => {
		const boardFromStorage = window.localStorage.getItem("board");
		return boardFromStorage
			? JSON.parse(boardFromStorage)
			: Array(9).fill(null);
	});
	const [turn, setTurn] = useState(() => {
		const turnFromStorage = window.localStorage.getItem("turn");
		return turnFromStorage ? turnFromStorage : TURNS.X;
	});
	const [contador, setContador] = useState(() => {
		const contadorFromStorage = window.localStorage.getItem("contador");
		console.log(JSON.parse(contadorFromStorage).X);
		return contadorFromStorage
			? JSON.parse(contadorFromStorage)
			: { X: 0, O: 0 };
	});
	const [winner, setWinner] = useState(null);

	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setWinner(null);
		const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
		setTurn(newTurn);

		window.localStorage.setItem("turn", newTurn);
		window.localStorage.removeItem("board");
	};

	const resetContador = () => {
		resetGame();
		setContador({ X: 0, O: 0 });

		window.localStorage.removeItem("contador");
	};

	const updateBoard = (index) => {
		if (board[index] || winner) return;

		const newBoard = [...board];
		newBoard[index] = turn;
		setBoard(newBoard);

		const newWinner = checkWinner(newBoard);
		if (newWinner) {
			setWinner(newWinner);
			confetti();
			const newContador = { ...contador };
			if (newWinner == TURNS.X) {
				newContador.X = newContador.X + 1;
				setContador(newContador);
			}
			if (newWinner == TURNS.O) {
				newContador.O = newContador.O + 1;
				setContador(newContador);
			}
			console.log(newContador);
			window.localStorage.setItem("contador", JSON.stringify(newContador));
		} else if (checkEndGame(newBoard)) {
			setWinner(false);
		} else {
			const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
			setTurn(newTurn);
			window.localStorage.setItem("turn", newTurn);
			window.localStorage.setItem("board", JSON.stringify(newBoard));
		}
	};

	return (
		<main className="board">
			<h1>3 en raya</h1>
			<section className="turn">
				<Square>
					<span>{contador.X}</span>
				</Square>
				<Square isSelected={turn === TURNS.X}>
					<SvgX />
				</Square>
				<Square isSelected={turn === TURNS.O}>
					<SvgO />
				</Square>
				<Square>
					<span>{contador.O}</span>
				</Square>
			</section>
			<section className="game">
				{board.map((square, index) => {
					return (
						<Square key={index} index={index} updateBoard={updateBoard}>
							{square === TURNS.X && <SvgX />}
							{square === TURNS.O && <SvgO />}
						</Square>
					);
				})}
			</section>
			<section className="botones">
				<button onClick={resetGame}>Reiniciar la partida</button>
				<button onClick={resetContador}>Reiniciar contador</button>
			</section>
			<WinnerModal resetGame={resetGame} winner={winner} />
		</main>
	);
}

export default App;
