import { useBetStore } from "@/domain/bet/model/store"
import React, { useCallback } from "react"

export const ZeroCell = React.memo(
	function ZeroCell({ betId, onMouseDown, onMouseEnter, isBetting, isWinner }) {

    const betAmount = useBetStore(
          useCallback(
            state => state.bets.find(b => b.id === betId)?.betAmount ?? 0,
            [betId],
          ),
        )

		return (
			<div className='betting-grid__cell-wrapper betting-grid__cell-wrapper--big'>
				<button
					className={`betting-grid__cell betting-grid__cell--zero ${
						betAmount > 0 ? 'active' : ''
					} ${isBetting ? '' : 'none-active'}`}
					type='button'
					onMouseDown={() => onMouseDown(betId)}
					onMouseEnter={() => onMouseEnter(betId)}
				>
					0
					{betAmount > 0 && (
						<div className='betting-grid__amount'>
							{betAmount.toFixed(2).replace('.', ',')}
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
