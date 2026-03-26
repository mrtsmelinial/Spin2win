import { useBetStore } from '@/domain/bet/model/store'
import React, { useCallback } from 'react'

export const AddBetCell = React.memo(function AddBetCell({
	item,
	onMouseDown,
	onMouseEnter,
	isBetting,
	isWinner,
	precision,
}) {
	const betAmount = useBetStore(
		useCallback(
			state => state.bets.find(b => b.id === item.id)?.betAmount ?? 0,
			[item.id],
		),
	)

	const backgroundColor =
		item.value === 'red'
			? 'var(--color-red)'
			: item.value === 'black'
				? 'var(--color-black)'
				: 'transparent'

	return (
		<div
			className={`betting-grid__cell-wrapper-add betting-grid__cell-wrapper-add--size-${item.size}`}
		>
			<button
				className={`betting-grid__cell-add ${betAmount > 0 ? 'active' : ''} ${isBetting ? '' : 'none-active'}`}
				type='button'
				style={{ backgroundColor }}
				onMouseDown={() => onMouseDown(item)}
				onMouseEnter={() => onMouseEnter(item)}
			>
				{item.type === 'range' || item.type === 'dozen'
					? `${item.value[0]}-${item.value[1]}`
					: item.value}

				{betAmount > 0 && (
					<div className='betting-grid__amount'>
						{betAmount.toFixed(precision).replace('.', ',')}
					</div>
				)}
			</button>
			{isWinner && (
				<img
					className={`betting-grid__border-add betting-grid__border-add--size-${item.size}`}
					src='/img/border-m.svg'
				/>
			)}
		</div>
	)
})
