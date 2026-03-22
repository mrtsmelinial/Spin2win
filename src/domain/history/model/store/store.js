import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { mapLastEvents } from '../../lib/mapLastEvents'

export const useHistoryStore = create(
	devtools(
		immer(set => ({
			historyCell: [],
			spinCount: 0,

			setLastEvents: data =>
				set(
					state => {
						if (data.last_events === undefined) return

						const mapped = mapLastEvents(data.last_events)

						const prevFirstId = state.historyCell[0]?.public_id
						const nextFirstId = mapped[0]?.public_id

						state.historyCell = mapped

						if (nextFirstId && nextFirstId !== prevFirstId) {
							state.spinCount += 1
						}
					},
					false,
					'history/setLastEvents',
				),
		})),
		{ name: 'HistoryStore' },
	),
)

export const { setLastEvents } = useHistoryStore.getState()
