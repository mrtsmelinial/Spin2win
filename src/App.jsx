import React from 'react'
import History from './component/History'
import Statistic from './component/Statistic'
import ControlColumn from './component/ControlColumn/ControlColumn'
import BetColumn from './component/BetColumn/BetColumn'
import { RouletteProvider } from './context/RouletteContext'

export default function App() {

	return (
		<RouletteProvider>
			<main className='roulette'>
				<div className='roulette__game-container'>
					<Statistic />
					<History />
					<div className='roulette__wrapper'>
						<ControlColumn />
						<BetColumn />
					</div>
				</div>
			</main>
		</RouletteProvider>
	)
}
