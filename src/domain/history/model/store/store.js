import { RED_NUMBERS, wheelSlots } from '@/shared/constants'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { useRoundStore } from '@/domain/round/model'
import { useTimeStore } from '@/domain/time/model'
import { mapLastEvents } from '../../lib/mapLastEvents'

export const useHistoryStore = create(
	devtools(
		immer(set => ({
			historyCell: [],
			spinCount: 0,

			historyTrimLast: () =>
				set(
					state => ({
						historyCell: state.historyCell.slice(0, -1),
					}),
					false,
					'history/historyTrimLast',
				),

			setLastEvents: data =>
				set(
					state => {
						if (data.last_events === undefined) return
						state.historyCell = mapLastEvents(data.last_events)
					},
					false,
					'history/setLastEvents',
				),

			spinComplete: cell =>
				set(
					state => {
						const { number, color } = cell
						const colorMap = { red: 'r', black: 'b', green: 'g' }
						const round = useRoundStore.getState().round
						const currentTime = useTimeStore.getState().currentTime
						const formatted = new Date(currentTime).toLocaleTimeString('ru-RU')
						state.historyCell.unshift({
							number,
							color: colorMap[color] ?? color,
							sector: wheelSlots[number]?.sector ?? '-',
							round,
							formatted,
						})
						state.spinCount += 1
					},
					false,
					'history/spinComplete',
				),
		})),
		{ name: 'HistoryStore' },
	),
)

export const { historyTrimLast, spinComplete, setLastEvents } =
	useHistoryStore.getState()
