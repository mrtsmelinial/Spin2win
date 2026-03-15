import { create } from 'zustand'
import { initialCell } from '@/shared/lib'
import { PHASES } from '@/shared/constants'
import { devtools } from 'zustand/middleware'
import { useBetStore } from '@/domain/bet'
import { useMyBetsStore } from '@/domain/mybets/model'
import { useRoundStore } from '@/domain/round/model'
import calculateMultiplier from '@/domain/bet/lib/calculateMultiplier'

export const useRouletteStore = create(
	devtools(set => ({
		phase: PHASES.PLACE_BETS,
		lastResult: null,
		initialCell,

		setActive: value =>
			set(
				{ phase: value ? PHASES.PLACE_BETS : PHASES.DRAW },
				false,
				'roulette/setActive',
			),
		spinComplete: cell =>
			set(
				state => {
					const betState = useBetStore.getState()
					const myBetsState = useMyBetsStore.getState()

					const currentRound = useRoundStore.getState(state => state.round)
					const activeBets = Object.values(betState.bets).filter(
						value => value.betAmount > 0,
					)
					const currentData = new Date().toLocaleString('ru-RU')
					const total = betState.bets.reduce(
						(acc, cells) => acc + cells.betAmount,
						0,
					)
					const quantityBets = activeBets.length
					const lastWin = betState.lastWin
					const details = activeBets.map(item => {
						const multiplier = calculateMultiplier(item, cell)
						const winningAmount = item.betAmount * multiplier

						let combination

						if (item.type === 'range' || item.type === 'dozen') {
							combination = `${item.value[0]}-${item.value[1]}`
						} else combination = item.value

						return {
							id: '000000000',
							status: winningAmount > 0 ? 'Win' : 'Lost',
							combination: combination,
							amount: item.betAmount,
							odds: `x${multiplier}`,
							win: winningAmount,
						}
					})

					if (quantityBets !== 0) {
						console.log(
							'АКТИВНЫЕ СТАВКИ ',
							activeBets,
							'ТЕКУЩИЙ РАУНД ',
							currentRound.round,
							'ДАТА СПИНА ',
							currentData,
							'ВЫИГРЫШНАЯ ЯЧЕЙКА ',
							cell,
							'КОЛИЧЕСТВО СТАВОК ',
							quantityBets,
							'ОБЩАЯ СУММА СТАВОК ',
							total,
							'ВЫИГРЫШ ',
							lastWin,
							'КОЭФИЦИЕНТ ВЫЙГРЫША ЯЧЕЙКИ И ВЫИГРЫШ',
							details,
						)
					} else console.log('НЕ БЫЛО СДЕЛАНО СТАВКИ')

					if (quantityBets !== 0) {
						myBetsState.addRound({
							date: currentData,
							round: `#${currentRound.round}`,
							result: { number: cell.number, color: cell.color },
							bets: quantityBets,
							amount: total,
							win: lastWin,
							details,
						})
					}

					state.lastResult = cell
				},
				false,
				'roulette/spinComplete',
			),
		spinReset: () =>
			set(
				{ lastResult: null, phase: PHASES.PLACE_BETS },
				false,
				'roulette/spinReset',
			),
	})),
	{ name: 'RouletteStore' },
)

export const { setActive, spinComplete, spinReset } =
	useRouletteStore.getState()
