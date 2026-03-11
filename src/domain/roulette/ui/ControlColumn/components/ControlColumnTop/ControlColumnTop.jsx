import React from 'react'
import ButtonFullscreen from './Buttons/ButtonFullscreen'
import ButtonMute from './Buttons/ButtonMute'
import NumberFlow from '@number-flow/react'
import { useBetStore } from '@/domain/bet'


export default function ControlColumnTop() {
	const balance = useBetStore(state => state.balance)

	return (
		<div className='roulette__control-top'>
			<ButtonFullscreen />
			<div className='roulette__balance'>
				<img className='roulette__icon-coin' src='../img/coins.svg' />
				<span>
					$
					<NumberFlow
						value={balance}
						format={{
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}}
					/>
				</span>
			</div>
			<ButtonMute />
		</div>
	)
}
