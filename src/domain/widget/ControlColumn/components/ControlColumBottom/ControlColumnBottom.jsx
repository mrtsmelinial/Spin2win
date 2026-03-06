import React from 'react'
import Jackpots from './Jackpots'
import JacpotsAmount from './JacpotsAmount'
import { useClickSound } from '@/domain/hooks'

export default function ControlColumnBottom() {
	const { playSound } = useClickSound()
	return (
		<div className='roulette__control-bottom'>
			<button
				className='roulette__button roulette__button--menu'
				onClick={() => playSound('button')}
			></button>
			<div className='roulette__session'># 650 825</div>
			<Jackpots />
			<JacpotsAmount />
		</div>
	)
}
