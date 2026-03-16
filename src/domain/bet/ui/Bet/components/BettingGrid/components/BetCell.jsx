import { useBetStore } from '@/domain/bet/model/store'
import React, { useCallback } from 'react'

export const BetCell = React.memo(
	function BetCells({ betId, betColor, betValue, onMouseDown, onMouseEnter, isBetting, isWinner }) {

		const betAmount = useBetStore(
					useCallback(
						state => state.bets.find(b => b.id === betId)?.betAmount ?? 0,
						[betId],
					),
				)

		return (
			<div className='betting-grid__cell-wrapper' key={betId}>
				<button
					onMouseDown={() => onMouseDown(betId)}
					onMouseEnter={() => onMouseEnter(betId)}
					className={`betting-grid__cell ${betAmount > 0 ? 'active' : ''} ${isBetting ? '' : 'none-active'}`}
					type='button'
					style={{
						backgroundColor: `var(--color-${betColor})`,
					}}
				>
					{betValue}

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
	},
	
)
