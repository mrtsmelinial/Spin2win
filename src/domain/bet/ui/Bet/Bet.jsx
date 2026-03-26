import React, { useState } from 'react'
import { BettingGrid } from './components'
import { BetControl } from './components'
import { TotalBet } from './components'
import { useBetStore } from '../../model'

export default function Bet() {
	const billInfo = useBetStore(state => state.billInfo)

	const betAmounts = Object.values(billInfo.button_list)

	const precision = billInfo.precision

	const [selectedChip, setSelectedChip] = useState(parseFloat(betAmounts[0]))

	return (
		<div className='bet'>
			<BettingGrid selectedChip={selectedChip} precision={precision} />
			<BetControl
				setSelectedChip={setSelectedChip}
				betAmounts={betAmounts}
				precision={precision}
			/>
			<TotalBet />
		</div>
	)
}
