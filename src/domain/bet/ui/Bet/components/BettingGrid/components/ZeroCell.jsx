import { useBetStore } from "@/domain/bet/model/store"
import React, { useCallback } from "react"

export const ZeroCell = React.memo(
	function ZeroCell({ item, onMouseDown, onMouseEnter, isBetting, isWinner, precision}) {

    const betAmount = useBetStore(
			useCallback(
				state => state.bets.find(b => b.id === item.id)?.betAmount ?? 0,
				[item.id],
			),
		)

		return (
			<div className='betting-grid__cell-wrapper betting-grid__cell-wrapper--big'>
				<button
					className={`betting-grid__cell betting-grid__cell--zero ${
						betAmount > 0 ? 'active' : ''
					} ${isBetting ? '' : 'none-active'}`}
					type='button'
					onMouseDown={() => onMouseDown(item)}
					onMouseEnter={() => onMouseEnter(item)}
				>
					0
					{betAmount > 0 && (
						<div className='betting-grid__amount'>
							{betAmount.toFixed(precision).replace('.', ',')}
						</div>
					)}
				</button>
				{isWinner && (
					<img
						className='betting-grid__border betting-grid__border--zero'
						src='/img/border-m.svg'
					/>
				)}
			</div>
		)
	},
	
)
