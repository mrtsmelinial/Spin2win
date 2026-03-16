import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useClickSound } from '@/shared/model'
import calculateMultiplier from '@/domain/bet/lib/calculateMultiplier'
import { useBetStore, addBet } from '@/domain/bet'
import { useRouletteStore } from '@/domain/roulette'
import { PHASES } from '@/shared/constants'
import { createInitialBets } from '@/shared/lib'
import { AddBetCell } from './components/AddBetCell'
import { BetCell } from './components/BetCell'
import { ZeroCell } from './components/ZeroCell'

const NUMBER_BETS = createInitialBets().filter(
	bet => bet.type === 'number' && bet.value !== 0,
)

const addBetsArray = [
	{ title: 'A', size: 2 },
	{ title: 'B', size: 2 },
	{ title: 'C', size: 2 },
	{ title: 'D', size: 2 },
	{ title: 'E', size: 2 },
	{ title: 'F', size: 2 },
	{ title: 'RED', size: 3 },
	{ title: 'BLACK', size: 3 },
	{ title: 'EVEN', size: 3 },
	{ title: 'ODD', size: 3 },
	{ title: '1-18', size: 3 },
	{ title: '19-36', size: 3 },
	{ title: '1-12', size: 2 },
	{ title: '13-24', size: 2 },
	{ title: '25-36', size: 2 },
]

const addBetIdMap = {
	A: 'section-a',
	B: 'section-b',
	C: 'section-c',
	D: 'section-d',
	E: 'section-e',
	F: 'section-f',
	RED: 'color-red',
	BLACK: 'color-black',
	EVEN: 'parity-even',
	ODD: 'parity-odd',
	'1-18': 'range-1-18',
	'19-36': 'range-19-36',
	'1-12': 'dozen-1',
	'13-24': 'dozen-2',
	'25-36': 'dozen-3',
}

export default function BettingGrid({ selectedChip }) {
	const bets = useBetStore(state => state.bets)
	const phase = useRouletteStore(state => state.phase)
	const isBetting = phase === PHASES.PLACE_BETS
	const lastResult = useRouletteStore(state => state.lastResult)

	const [isAddBetsMode, setIsAddBetsMode] = useState(false)
	const isDragging = useRef(null)
	const { playSound } = useClickSound()

	const selectedChipRef = useRef(selectedChip)

	useEffect(() => {
		selectedChipRef.current = selectedChip
	}, [selectedChip])

	const handleBetMouseDown = useCallback(
		id => {
			if (!isBetting || !selectedChipRef.current) return
			isDragging.current = true
			addBet({ id, amount: selectedChipRef.current })
			playSound('bet')
		},
		[isBetting, playSound],
	)

	const handleBetMouseEnter = useCallback(
		id => {
			if (!isBetting || !isDragging.current) return
			addBet({ id, amount: selectedChipRef.current })
			playSound('bet')
		},
		[isBetting, playSound],
	)

	const handleMouseUp = useCallback(() => (isDragging.current = false), [])

	const winnerIds = useMemo(() => {
		if (!lastResult) return new Set()

		return new Set(
			bets
				.filter(bet => calculateMultiplier(bet, lastResult) > 0)
				.map(bet => bet.id),
		)
	}, [lastResult, bets])

	

	return (
		<div className='betting-grid' onMouseUp={handleMouseUp}>
			<div className='betting-grid__main'>
				{isAddBetsMode
					? addBetsArray.map(item => (
							<AddBetCell
								key={item.title}
								betId={addBetIdMap[item.title]}
								item={item}
								onMouseDown={handleBetMouseDown}
								onMouseEnter={handleBetMouseEnter}
								isBetting={isBetting}
								isWinner={winnerIds.has(addBetIdMap[item.title])}
							/>
						))
					: NUMBER_BETS.map(bet => (
							<BetCell
								key={bet.id}
								betId={bet.id}
								betValue={bet.value}
								betColor={bet.color}
								onMouseDown={handleBetMouseDown}
								onMouseEnter={handleBetMouseEnter}
								isBetting={isBetting}
								isWinner={winnerIds.has(bet.id)}
							/>
						))}
			</div>
			<div className='betting-grid__footer'>
				{isAddBetsMode ? (
					''
				) : (
					<ZeroCell
						betId='number-0'
						onMouseDown={handleBetMouseDown}
						onMouseEnter={handleBetMouseEnter}
						isBetting={isBetting}
						isWinner={winnerIds.has('number-0')}
					/>
				)}
				<button
					className='betting-grid__cell betting-grid__cell--more-bets'
					type='button'
					onClick={() => {
						setIsAddBetsMode(prev => !prev)
						playSound('button')
					}}
				>
					{isAddBetsMode ? 'MAIN BETS' : 'ADD.BETS'}
				</button>
			</div>
		</div>
	)
}
