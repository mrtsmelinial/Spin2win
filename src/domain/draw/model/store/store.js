import { devtools } from "globals"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

export const useDrawStore = create(
	devtools(
		immer(set => ({
			time: null,
			interval: null,

			setTime: data =>
				set(
					state => {
						if (data.time !== undefined) state.time = data.time
						if (data.interval !== undefined) state.interval = data.interval
					},
					false,
					'draw/setTime',
				),
		})),
		{ name: 'DrawStore' },
	),
)

export const { setTime } = useDrawStore.getState()
