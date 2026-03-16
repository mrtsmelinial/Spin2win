import React from 'react'
import { useBetStore } from '@/domain/bet'
import NumberFlow from '@number-flow/react'

export default function Balance() {
	const balance = useBetStore(state => state.balance)

  return (
		<div className='balance'>
			<img className='balance__icon-coin' src='../img/coins.svg' />
			<span>
				$
				<NumberFlow
					value={balance}
					format={{
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}}
				/>
			</span>
		</div>
	)
}
