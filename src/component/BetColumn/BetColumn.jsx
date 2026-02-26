import React, { useEffect, useState } from 'react'
import BetColumnBettingGrid from './BetColumnBettingGrid'
import BetColumnControls from './BetColumnControls'
import BetColumnTotalBet from './BetColumnTotalBet'
import { useRoulette } from '../../context/RouletteContext'

const sumBet = ['0,10', '1,00', '2,00', '5,00', '10,00']

const redNumbers = new Set([
	1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
])

const rouletteData = Array.from({ length: 37 }, (_, i) => {
	let color

	if (i === 0) color = 'g'
	else if (redNumbers.has(i)) color = 'r'
	else color = 'b'

	return {
		number: i,
		color,
		betAmount: 0,
	}
})
export default function BetColumn() {

	const {dispatch} = useRoulette()

	const [selectedChip, setSelectedChip] = useState(
		parseFloat(sumBet[0].replace(',', '.')),
	)

	useEffect(() => {
		dispatch({
			type: 'INIT_CELLS',
			payload: rouletteData,
		})
	}, [dispatch])

	return (
		<div className='roulette__bet'>
			<BetColumnBettingGrid
				selectedChip={selectedChip}
			/>
			<BetColumnControls
				setSelectedChip={setSelectedChip}
				sumBet={sumBet}
			/>
			<BetColumnTotalBet />
		</div>
	)
}
