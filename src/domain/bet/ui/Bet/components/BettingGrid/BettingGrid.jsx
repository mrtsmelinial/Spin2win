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

const ADD_BETS = createInitialBets().filter(bet => bet.type !== 'number')

const ZERO_BET = createInitialBets().find(
	bet => bet.type === 'number' && bet.value === 0,
)

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
		item => {
			if (!isBetting || !selectedChipRef.current) return
			isDragging.current = true
			addBet({
				id: item.id,
				value: item.value,
				amount: selectedChipRef.current,
			})
			playSound('bet')
		},
		[isBetting, playSound],
	)

	const handleBetMouseEnter = useCallback(
		item => {
			if (!isBetting || !isDragging.current) return
			addBet({
				id: item.id,
				value: item.value,
				amount: selectedChipRef.current,
			})
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
					? ADD_BETS.map(bet => (
							<AddBetCell
								key={bet.id}
								item={bet}
								onMouseDown={handleBetMouseDown}
								onMouseEnter={handleBetMouseEnter}
								isBetting={isBetting}
								isWinner={winnerIds.has(bet.id)}
							/>
						))
					: NUMBER_BETS.map(bet => (
							<BetCell
								key={bet.id}
								item={bet}
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
						item={ZERO_BET}
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
