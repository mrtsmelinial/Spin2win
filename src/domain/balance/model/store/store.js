import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const useBalanceStore = create(
	devtools(
		immer(set => ({
			balance: 0,
			setBalance: newBalance =>
				set(state => {
					state.balance = parseFloat(newBalance)
				}),
			addBalance: amount =>
				set(
					state => {
						state.balance = state.balance + parseFloat(amount)
					},
					false,
					'balance/addBalance',
				),
		})),
	),
)

export const { setBalance, addBalance } = useBalanceStore.getState()
