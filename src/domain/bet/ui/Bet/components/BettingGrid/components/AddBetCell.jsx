import { useBetStore } from "@/domain/bet/model/store"
import React, { useCallback } from "react"

export const AddBetCell = React.memo(
	function AddBetCell({
		betId,
		item,
		onMouseDown,
		onMouseEnter,
		isBetting,
		isWinner,
	}) {

		const betAmount = useBetStore(
			useCallback(
				state => state.bets.find(b => b.id === betId)?.betAmount ?? 0,
				[betId],
			),
		)

		const backgroundColor =
			item.title === 'RED'
				? 'var(--color-red)'
				: item.title === 'BLACK'
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
					onMouseDown={() => onMouseDown(betId)}
					onMouseEnter={() => onMouseEnter(betId)}
				>
					{item.title}
					{betAmount > 0 && (
						<div className='betting-grid__amount'>
							{betAmount.toFixed(2).replace('.', ',')}
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
	},
	
)
