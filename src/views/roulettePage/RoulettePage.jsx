import React from 'react'
import { AdaptiveFrame } from '@/shared/ui'
import { Statistic } from '@/domain/statistic'
import { ControlColumn } from '@/domain/roulette'
import { BetColumn } from '@/domain/bet'
import { HistoryCell } from '@/domain/history'
import { WinDisplay } from '@/domain/bet'
import { usePreloadImages } from '@/shared/model'

const IMG_PRELOAD = [
	'/img/reward-coins.svg',
	'/img/roulette-num-black-center.svg',
	'/img/roulette-num-red-center.svg',
	'/img/roulette-num-green-center.svg',
]

export default function RoulettePage() {
	usePreloadImages(IMG_PRELOAD)

	return (
		<main className='roulette'>
			<AdaptiveFrame>
				<div className='roulette__game-container'>
					<Statistic />
					<HistoryCell />
					<div className='roulette__wrapper'>
						<ControlColumn/>
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
