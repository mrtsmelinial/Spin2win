import { useBetStore } from '@/domain/bet/model/store'
import React, { useCallback } from 'react'

export const BetCell = React.memo(function BetCells({
	item,
	onMouseDown,
	onMouseEnter,
	isBetting,
	isWinner,
}) {
	const betAmount = useBetStore(
		useCallback(
			state => state.bets.find(b => b.id === item.id)?.betAmount ?? 0,
			[item.id],
		),
	)

	return (
		<div className='betting-grid__cell-wrapper' key={item.id}>
			<button
				onMouseDown={() => onMouseDown(item)}
				onMouseEnter={() => onMouseEnter(item)}
				className={`betting-grid__cell ${betAmount > 0 ? 'active' : ''} ${isBetting ? '' : 'none-active'}`}
				type='button'
				style={{
					backgroundColor: `var(--color-${item.color})`,
				}}
			>
				{item.value}

				{betAmount > 0 && (
					<div className='betting-grid__amount'>
						{betAmount.toFixed(2).replace('.', ',')}
					</div>
				)}
			</button>
			{isWinner && (
				<div className='betting-grid__border' src='/img/border-m.svg'></div>
			)}
		</div>
	)
})
