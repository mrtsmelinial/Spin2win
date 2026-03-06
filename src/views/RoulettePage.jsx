import React, { useState } from 'react'
import { AdaptiveFrame } from '@/shared/ui'
import { Statistic } from '@/domain/widget'
import { ControlColumn } from '@/domain/widget'
import { BetColumn } from '@/domain/widget'
import { HistoryCell } from '@/domain/widget'
import { usePreloadImages } from '@/shared/hooks'
import { getCellRandom } from '@/domain/utils'
import { useRouletteHistory } from '@/domain/hooks'

const IMG_PRELOAD = [
	'/img/reward-coins.svg',
	'/img/roulette-num-black-center.svg',
	'/img/roulette-num-red-center.svg',
	'/img/roulette-num-green-center.svg',
]

export default function RoulettePage() {
	const [initialCell] = useState(() => getCellRandom())
	usePreloadImages(IMG_PRELOAD)
	const { historyCell, addSpin, spinCount } = useRouletteHistory(initialCell)

	return (
		<main className='roulette'>
			<AdaptiveFrame>
				<div className='roulette__game-container'>
					<Statistic />
					<HistoryCell historyCell={historyCell} spinCount={spinCount} />
					<div className='roulette__wrapper'>
						<ControlColumn initialCell={initialCell} onSpinComplete={addSpin} />
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
	)
}
