import React from 'react'
import { useClickSound } from '@/domain/hooks'
import JackpotSlider from './JackpotsSlider'

export default function ControlColumnBottom() {
	const { playSound } = useClickSound()
	return (
		<div className='roulette__control-bottom'>
			<button
				className='roulette__button roulette__button--menu'
				onClick={() => playSound('button')}
			></button>
			<div className='roulette__session'># 650 825</div>
			<JackpotSlider/>
		</div>
	)
}
