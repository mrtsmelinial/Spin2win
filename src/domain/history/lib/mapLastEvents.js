import { RED_NUMBERS, wheelSlots } from "@/shared/constants"

export function mapLastEvents(lastEvents) {
	return lastEvents.map(event => {
		const number = parseInt(event.event_result)

		let color
		if (number === 0) color = 'g'
		else if (RED_NUMBERS.has(number)) color = 'r'
		else color = 'b'

		return {
			number,
			color,
			sector: wheelSlots[number]?.sector ?? '-',
			round: parseInt(event.public_id),
			formatted: new Date(event.event_date).toLocaleTimeString('ru-RU'),
		}
	})
}
