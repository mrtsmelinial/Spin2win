import React from 'react'
import History from './component/History'
import Statistic from './component/Statistic'
import ControlColumn from './component/ControlColumn'
import BetColumn from './component/BetColumn'

export default function App() {
	return (
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
	)
}
