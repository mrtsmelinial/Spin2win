import React, { useEffect } from 'react'
import NumberFlow from '@number-flow/react'
import { useBalanceStore } from '../model'
import { useJackpotStore } from '@/domain/jackpot'
import { undo, useBetStore } from '@/domain/bet'
import { useDrawStore } from '@/domain/draw'

export default function Balance() {
	const balance = useBalanceStore(state => state.balance)
	const jackpots = useJackpotStore(state => state.jackpots)
	const totalStake = useBetStore(state => state.totalStake)
	const phase = useDrawStore(state => state.phase)
	const precision = Object.values(jackpots)[0].precision
	const symbol = Object.values(jackpots)[0].currency_symbol

	useEffect(() => {
		if (phase === 'WINNERS') return
		if (balance >= totalStake) return

		let currentStake = totalStake
		while (currentStake > balance) {
			undo()
			currentStake = useBetStore.getState().totalStake
			if (currentStake === 0) break
		}
	}, [balance, phase])

	return (
		<div className='balance'>
			<img className='balance__icon-coin' src='../img/coins.svg' />
			<span>
				{symbol}
				<NumberFlow
					value={phase === 'WINNERS' ? balance : balance - totalStake}
					format={{
						minimumFractionDigits: precision,
						maximumFractionDigits: precision,
					}}
				/>
			</span>
		</div>
	)
}
