import React, { useState } from 'react'
import { BetColumnBettingGrid } from './components'
import { BetColumnControls } from './components'
import { BetColumnTotalBet } from './components'

const sumBet = ['0,50', '1,00', '2,00', '3,00', '5,00', '10,00']

export default function BetColumn({ betting }) {
	const [selectedChip, setSelectedChip] = useState(
		parseFloat(sumBet[0].replace(',', '.')),
	)

	return (
		<div className='roulette__bet'>
			<BetColumnBettingGrid selectedChip={selectedChip} betting={betting} />
			<BetColumnControls
				setSelectedChip={setSelectedChip}
				sumBet={sumBet}
				betting={betting}
			/>
			<BetColumnTotalBet />
		</div>
	)
}
