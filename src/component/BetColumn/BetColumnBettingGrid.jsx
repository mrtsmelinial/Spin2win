import React, { useState } from 'react'
import { useRoulette } from '../../context/RouletteContext'
import { useClickSound } from '../../context/AudioProvider'

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
export default function BetColumnBettingGrid({ selectedChip }) {
	const { state, dispatch } = useRoulette()
	const [isAddBetsMode, setIsAddBetsMode] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const { playSound } = useClickSound()

	const handleMouseDown = number => {
		if (!selectedChip) return
		setIsDragging(true)

		dispatch({
			type: 'ADD_BET',
			id: `number-${number}`,
			amount: selectedChip,
		})
		if (state.betting) {
			playSound('bet')
		} else return
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	const handleCellEnter = number => {
		if (!isDragging) return

		dispatch({ type: 'ADD_BET', id: `number-${number}`, amount: selectedChip })
		if (state.betting) {
			playSound('bet')
		} else return
	}

	const { lastResult } = state

	const isWinner = bet => {
		if (!lastResult) return false
		const { number, color, sector } = lastResult
		switch (bet.type) {
			case 'number':
				return bet.value === number
			case 'color':
				return number !== 0 && bet.value === color
			case 'parity':
				if (number === 0) return false
				return (
					(bet.value === 'even' && number % 2 === 0) ||
					(bet.value === 'odd' && number % 2 !== 0)
				)
			case 'range':
				return number !== 0 && number >= bet.value[0] && number <= bet.value[1]
			case 'dozen':
				return number !== 0 && number >= bet.value[0] && number <= bet.value[1]
			case 'section':
				return bet.value === sector
			default:
				return false
		}
	}

	const numberBets = state.bets.filter(bet => bet.type === 'number')
	const zeroCell = state.bets.find(bet => bet.id === 'number-0')

	return (
		<div className='roulette__cell' onMouseUp={handleMouseUp}>
			<div className='roulette__cell-grid'>
				{isAddBetsMode
					? addBetsArray.map((item, index) => {
							const betId = addBetIdMap[item.title]

							const bet = state.bets.find(b => b.id === betId)

							let backgroundColor = 'transparent'
							if (item.title === 'RED') backgroundColor = 'var(--color-red)'
							if (item.title === 'BLACK')
								backgroundColor = 'var(--color-black)'

							return (
								<div
									className={`roullette__wrapper-add${item.size}`}
									key={index}
								>
									<button
										className={`roulette__cell-item-add roulette__cell-item-add--size-${item.size} ${bet?.betAmount > 0 ? 'active' : ''} ${state.betting ? '' : 'none-active'}`}
										type='button'
										style={{ backgroundColor }}
										onMouseDown={() => {
											if (!selectedChip) return
											setIsDragging(true)
											dispatch({
												type: 'ADD_BET',
												id: betId,
												amount: selectedChip,
											})
											if (state.betting) {
												playSound('bet')
											} else return
										}}
										onMouseEnter={() => {
											if (!isDragging) return
											dispatch({
												type: 'ADD_BET',
												id: betId,
												amount: selectedChip,
											})
											if (state.betting) {
												playSound('bet')
											} else return
										}}
									>
										{item.title}

										{bet?.betAmount > 0 && (
											<div className='roulette__cell-bet'>
												{bet.betAmount.toFixed(2).replace('.', ',')}
											</div>
										)}
									</button>
									{isWinner(state.bets.find(b => b.id === betId)) && (
										<img
											className={`roulette__cell-item-winner-add${item.size}`}
											src='/img/border-m.svg'
										/>
									)}
								</div>
							)
						})
					: numberBets
							.filter(bet => bet.value !== 0)
							.map(bet => (
								<div className='roulette__cell-wrapper' key={bet.id}>
									<button
										onMouseDown={() => handleMouseDown(bet.value)}
										onMouseEnter={() => handleCellEnter(bet.value)}
										className={`roulette__cell-item ${bet.betAmount > 0 ? 'active' : ''} ${state.betting ? '' : 'none-active'}`}
										type='button'
										style={{
											backgroundColor: `var(--color-${bet.color})`,
										}}
									>
										{bet.value}

										{bet.betAmount > 0 && (
											<div className='roulette__cell-bet'>
												{bet.betAmount.toFixed(2).replace('.', ',')}
											</div>
										)}
									</button>
									{isWinner(bet) && (
										<div className='roulette__cell-item-winner'></div>
									)}
								</div>
							))}
			</div>

			<div className='roulette__cell-footer'>
				{isAddBetsMode ? (
					''
				) : (
					<div className='roulette__cell-wrapper roulette__cell-wrapper--big'>
						<button
							className={`roulette__cell-item roulette__cell-item--zero ${
								zeroCell && zeroCell.betAmount > 0 ? 'active' : ''
							} ${state.betting ? '' : 'none-active'}`}
							type='button'
							onMouseDown={() => handleMouseDown(0)}
							onMouseEnter={() => handleCellEnter(0)}
						>
							0
							{zeroCell && zeroCell.betAmount > 0 && (
								<div className='roulette__cell-bet'>
									{zeroCell.betAmount.toFixed(2).replace('.', ',')}
								</div>
							)}
							{isWinner(zeroCell) && (
								<img
									className='roulette__cell-item-winner-add1'
									src='/img/border-m.svg'
								/>
							)}
						</button>
					</div>
				)}
				<button
					className='roulette__cell-item roulette__cell-item--more-bets'
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
