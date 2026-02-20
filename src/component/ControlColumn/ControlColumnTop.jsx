import React from 'react'
import ButtonFullscreen from './Buttons/ButtonFullscreen'
import ButtonMute from './Buttons/ButtonMute'

export default function ControlColumnTop() {
	return (
		<div className='roulette__control-top'>
			<ButtonFullscreen />
			<div className='roulette__balance'>
				<img className='roulette__icon-coin' src='../img/coins.svg' />
				<span>$10000,00</span>
			</div>
			<ButtonMute />
		</div>
	)
}
