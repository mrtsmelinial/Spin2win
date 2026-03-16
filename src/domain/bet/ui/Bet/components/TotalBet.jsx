import React from 'react'
import { useBetStore } from '@/domain/bet'

export default function TotalBet() {
	const bets = useBetStore(state => state.bets)

	const total = bets.reduce((acc, cell) => acc + cell.betAmount, 0)
	return (
		<div className='total-bet'>
			<span className='total-bet__text'>TOTAL AMOUNT OF BET:</span>
			<span className='total-bet__amount'>
				{total.toFixed(2).replace('.', ',')}
			</span>
		</div>
	)
}
