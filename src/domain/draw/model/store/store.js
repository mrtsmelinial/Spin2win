import { PHASES, wheelSlots } from '@/shared/constants'
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const useDrawStore = create(
	subscribeWithSelector(
		devtools(
			immer(set => ({
				time: null,
				interval: null,
				isReady: false,
				hasError: false,
				result: null,
				phase: PHASES.PLACE_BETS,

				setResultCell: data =>
					set(
						state => {
							state.result = {
								number: Number(data.result),
								...wheelSlots[data.result],
							}
						},
						false,
						'draw/setResultCell',
					),

				handlePases: value =>
					set(
						state => {
							if (value === 'draw') {
								state.phase = PHASES.DRAW
							} else if (value === 'winners') {
								state.phase = PHASES.WINNERS
							} else if (value === 'place_bets') {
								state.phase = PHASES.PLACE_BETS
							}
						},
						false,
						'draw/handlePases',
					),

				setTime: data =>
					set(
						state => {
							if (data.time !== undefined) state.time = data.time
							if (data.interval !== undefined) state.interval = data.interval
						},
						false,
						'draw/setTime',
					),

				setReady: value =>
					set(
						state => {
							state.isReady = value
						},
						false,
						'draw/setReady',
					),

				setError: () =>
					set(
						state => {
							state.hasError = true
						},
						false,
						'draw/setError',
					),
			})),
			{ name: 'DrawStore' },
		),
	),
)

export const {
	setTime,
	setReady,
	setError,
	setResultCell,
	handlePases,
} = useDrawStore.getState()
