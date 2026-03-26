import React from 'react'
import { useBetStore } from '@/domain/bet'

export default function TotalBet() {
	const totalStake = useBetStore(state => state.totalStake)
	const billInfo = useBetStore(state => state.billInfo)

	const precision = billInfo.precision

	return (
		<div className='total-bet'>
			<span className='total-bet__text'>TOTAL AMOUNT OF BET:</span>
			<span className='total-bet__amount'>
				{totalStake.toFixed(precision).replace('.', ',')}
			</span>
		</div>
	)
}
