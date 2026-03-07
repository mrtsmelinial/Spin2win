import React from 'react'
import { AdaptiveFrame } from '@/shared/ui'
import { Statistic } from '@/domain/statistic/ui'
import { ControlColumn } from '@/domain/roulette/ui'
import { BetColumn } from '@/domain/bet/ui'
import { HistoryCell } from '@/domain/history/ui'
import { WinDisplay } from '@/domain/bet/ui'
import { usePreloadImages } from '@/shared/model'
import { selectInitialCell } from '@/domain/roulette/model/selectors'
import { useSelector } from 'react-redux'

const IMG_PRELOAD = [
	'/img/reward-coins.svg',
	'/img/roulette-num-black-center.svg',
	'/img/roulette-num-red-center.svg',
	'/img/roulette-num-green-center.svg',
]

export default function RoulettePage() {
	usePreloadImages(IMG_PRELOAD)
	const initialCell = useSelector(selectInitialCell)

	return (
		<main className='roulette'>
			<AdaptiveFrame>
				<div className='roulette__game-container'>
					<Statistic />
					<HistoryCell />
					<div className='roulette__wrapper'>
						<ControlColumn initialCell={initialCell} />
						<BetColumn />
					</div>
					<WinDisplay />
				</div>
			</AdaptiveFrame>
			<div className='roulette__phone'>
				<span className='roulette__phone-text'>
					Please switch to landscape mode.
				</span>
				<img alt='rotate-screen' src='/img/rotate-screen.gif' />
			</div>
		</main>
	)
}
