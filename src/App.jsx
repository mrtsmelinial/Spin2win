import React, { useEffect, useState } from 'react'
import History from './component/History'
import Statistic from './component/Statistic'
import ControlColumn from './component/ControlColumn/ControlColumn'
import BetColumn from './component/BetColumn/BetColumn'
import { RouletteProvider } from './context/RouletteContext'
import { getCellRandom } from './reducers/CreateRandomCell'
import { AudioProvider } from './context/AudioProvider'
import { AdaptiveFrame } from './adaptive-frame'

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

	useEffect(() => {
		const images = [
			'/img/reward-coins.svg',
			'/img/roulette-num-black-center.svg',
			'/img/roulette-num-red-center.svg',
			'/img/roulette-num-green-center.svg',
		]

		images.forEach(src => {
			const img = new Image()
			img.src = src
		})
	}, [])

	return (
		<RouletteProvider>
			<AudioProvider>
				<main className='roulette'>
					<AdaptiveFrame>
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
					</AdaptiveFrame>
					<div className='roulette__phone'>
						<span className='roulette__phone-text'>
							Please switch to landscare mode.
						</span>
						<img alt='rotate-scren' src='/img/rotate-screen.gif' />
					</div>
				</main>
			</AudioProvider>
		</RouletteProvider>
	)
}
