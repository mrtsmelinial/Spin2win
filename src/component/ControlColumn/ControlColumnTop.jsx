import React from 'react'
import ButtonFullscreen from './Buttons/ButtonFullscreen'
import ButtonMute from './Buttons/ButtonMute'
import { useRoulette } from '../../context/RouletteContext'

export default function ControlColumnTop() {
	const {state} = useRoulette()

	return (
		<div className='roulette__control-top'>
			<ButtonFullscreen />
			<div className='roulette__balance'>
				<img className='roulette__icon-coin' src='../img/coins.svg' />
				<span>${state.balance}</span>
			</div>
			<ButtonMute />
		</div>
	)
}
