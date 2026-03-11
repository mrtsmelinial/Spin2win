import React from 'react'
import JackpotSlider from '@/domain/jackpot'
import Round from '@/domain/round'
import Menu from '@/domain/menu'

export default function ControlColumnBottom() {
	return (
		<div className='roulette__control-bottom'>
			<Menu />
			<Round />
			<JackpotSlider />
		</div>
	)
}
