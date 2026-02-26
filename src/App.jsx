import React, { useState } from 'react'
import History from './component/History'
import Statistic from './component/Statistic'
import ControlColumn from './component/ControlColumn/ControlColumn'
import BetColumn from './component/BetColumn/BetColumn'
import { RouletteProvider } from './context/RouletteContext'
import { getCellRandom } from './reducers/CreateRandomCell'


export default function App() {

	const [initialCell] = useState(() => getCellRandom())

	const generateInitialHistory = firstCell => {
		const redNumbers = new Set([
			1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
		])

		const rest = Array.from({ length: 9 }, () => {
			const number = Math.floor(Math.random() * 37)
			let color
			if (number === 0) color = 'g'
			else if (redNumbers.has(number)) color = 'r'
			else color = 'b'
			return { number, color }
		})

		const colorMap = { red: 'r', black: 'b', green: 'g' }

		return [
			{ number: firstCell.number, color: colorMap[firstCell.color] },
			...rest,
		]

	}

	const [history, setHistory] = useState(() =>
		generateInitialHistory(initialCell),
	)

	return (
		<RouletteProvider>
			<main className='roulette'>
				<div className='roulette__game-container'>
					<Statistic />
					<History history={history} />
					<div className='roulette__wrapper'>
						<ControlColumn
							initialCell={initialCell}
							onSpinComplete={cell => {
								setHistory(prev => [cell, ...prev])
								setTimeout(() => {
									setHistory(prev => prev.slice(0, -1))
								}, 1000) 
							}}
						/>
						<BetColumn />
					</div>
				</div>
			</main>
		</RouletteProvider>
	)
}
