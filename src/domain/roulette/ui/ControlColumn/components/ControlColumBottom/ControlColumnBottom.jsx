import React from 'react'
import JackpotSlider from '@/domain/jackpot'
import Round from '@/domain/round'
import { MenuButton } from '@/domain/menu'

export default function ControlColumnBottom() {
	return (
		<div className='roulette__control-bottom'>
			<MenuButton />
			<Round />
			<JackpotSlider />
		</div>
	)
}
