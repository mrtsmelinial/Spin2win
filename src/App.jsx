import React, { useState } from 'react'
import History from './component/History'
import Statistic from './component/Statistic'
import ControlColumn from './component/ControlColumn/ControlColumn'
import BetColumn from './component/BetColumn/BetColumn'
import { RouletteProvider } from './context/RouletteContext'
import { getCellRandom } from './reducers/CreateRandomCell'
import { AudioProvider } from './context/AudioProvider'
import { AdaptiveFrame } from './adaptive-frame'
import { usePreloadImages } from './hooks/usePreloadImages'
import { useRouletteHistory } from './hooks/useRouletteHistory'

const IMG_PRELAOD = [
	'/img/reward-coins.svg',
	'/img/roulette-num-black-center.svg',
	'/img/roulette-num-red-center.svg',
	'/img/roulette-num-green-center.svg',
]

export default function App() {
	const [initialCell] = useState(() => getCellRandom())
	usePreloadImages(IMG_PRELAOD)
	const { history, addSpin } = useRouletteHistory(initialCell)

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
									onSpinComplete={addSpin}
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
