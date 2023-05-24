import { TURNS } from "../constants"
import { Square } from "./Square"
import { SvgO } from "./SvgO"
import { SvgX } from "./SvgX"

export function WinnerModal({winner, resetGame}) {
	if (winner === null) return null
	
	const winnerText = winner === false ? "Empate" : "Ganó"

	return (
		<section className="winner">
			<div className="text">
				<h2>{winnerText}</h2>
				{winner && 
					<header className="win">
						<Square>
							{winner === TURNS.X && <SvgX />}
							{winner === TURNS.O && <SvgO />}
						</Square>
					</header>
				}
				<footer>
					<button onClick={resetGame}>Nueva partida</button>
				</footer>
			</div>
		</section>
	)
}