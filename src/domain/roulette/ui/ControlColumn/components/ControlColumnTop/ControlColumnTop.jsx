import React from 'react'
import ButtonFullscreen from './Buttons/ButtonFullscreen'
import ButtonMute from './Buttons/ButtonMute'
import Balance from '@/domain/balance'

export default function ControlColumnTop() {
	return (
		<div className='roulette__control-top'>
			<ButtonFullscreen />
			<Balance />
			<ButtonMute />
		</div>
	)
}
