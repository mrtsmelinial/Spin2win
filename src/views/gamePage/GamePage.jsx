import React, { useEffect } from 'react'
import { AdaptiveFrame, MenuButton } from '@/shared/ui'
import { Statistic, useStatisticStore } from '@/domain/statistic'
import { BetColumn } from '@/domain/bet'
import { HistoryCell } from '@/domain/history'
import { WinDisplay } from '@/domain/bet'
import { usePreloadImages } from '@/shared/model'
import { Menu } from '@/domain/menu'
import { useHistoryStore } from '@/domain/history/model/store'
import JackpotSlider from '@/domain/jackpot'
import Round from '@/domain/round'
import Balance from '@/domain/balance'
import { ButtonFullscreen, ButtonMute } from '@/shared/ui'
import { Roulette } from '@/domain/roulette'

const IMG_PRELOAD = [
	'/img/reward-coins.svg',
	'/img/roulette-num-black-center.svg',
	'/img/roulette-num-red-center.svg',
	'/img/roulette-num-green-center.svg',
]

export default function GamePage() {
	usePreloadImages(IMG_PRELOAD)
	useEffect(() => {
		const historyCell = useHistoryStore.getState().historyCell
		useStatisticStore.getState().initFromHistory(historyCell)
	}, [])

	return (
		<main className='game'>
			<AdaptiveFrame>
				<div className='game__container-main'>
					<Statistic />
					<HistoryCell />
					<div className='game__wrapper'>
						<div className='game__container'>
							<div className='game__container-top'>
								<ButtonFullscreen />
								<Balance />
								<ButtonMute />
							</div>
							<Roulette />
							<div className='game__container-bottom'>
								<MenuButton />
								<Round />
								<JackpotSlider />
							</div>
						</div>
						<BetColumn />
					</div>
					<WinDisplay />
				</div>
				<Menu />
			</AdaptiveFrame>
			<div className='game__media-phone'>
				<span className='game__media-phone-text'>
					Please switch to landscape mode.
				</span>
				<img alt='rotate-screen' src='/img/rotate-screen.gif' />
			</div>
		</main>
	)
}
