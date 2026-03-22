import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const useDrawStore = create(
	devtools(
		immer(set => ({
			time: null,
			interval: null,
			isReady: false,
			hasError: false,

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
)

export const { setTime, setReady, setResult, setError } = useDrawStore.getState()
