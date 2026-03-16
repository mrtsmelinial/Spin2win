import React, { useState } from 'react'
import { BettingGrid } from './components'
import { BetControl } from './components'
import { TotalBet } from './components'

const sumBet = ['0,50', '1,00', '2,00', '3,00', '5,00', '10,00']

export default function Bet() {
	const [selectedChip, setSelectedChip] = useState(
		parseFloat(sumBet[0].replace(',', '.')),
	)

	return (
		<div className='bet'>
			<BettingGrid selectedChip={selectedChip} />
			<BetControl
				setSelectedChip={setSelectedChip}
				sumBet={sumBet}
			/>
			<TotalBet />
		</div>
	)
}
