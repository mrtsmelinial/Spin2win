import React from 'react'
import BetColumnBettingGrid from './BetColumnBettingGrid'
import BetColumnControls from './BetColumnControls'
import BetColumnTotalBet from './BetColumnTotalBet'

export default function BetColumn() {
	return (
		<div className='roulette__bet'>
			<BetColumnBettingGrid/>
			<BetColumnControls/>
			<BetColumnTotalBet/>
		</div>
	)
}
