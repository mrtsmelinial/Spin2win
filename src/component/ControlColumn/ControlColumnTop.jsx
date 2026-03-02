import React from 'react'
import ButtonFullscreen from './Buttons/ButtonFullscreen'
import ButtonMute from './Buttons/ButtonMute'
import { useRoulette } from '../../context/RouletteContext'
import NumberFlow from '@number-flow/react'


export default function ControlColumnTop() {
	const { state } = useRoulette()

	return (
		<div className='roulette__control-top'>
			<ButtonFullscreen />
			<div className='roulette__balance'>
				<img className='roulette__icon-coin' src='../img/coins.svg' />
				<span>
					$
					<NumberFlow
						value={state.balance}
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
