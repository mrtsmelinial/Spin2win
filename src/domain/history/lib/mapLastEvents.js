import { RED_NUMBERS, wheelSlots } from "@/shared/constants"

function parseDate(dateStr) {
	const [datePart, timePart] = dateStr.split(' ')
	const [day, month, year] = datePart.split('.')
	return new Date(`${year}-${month}-${day}T${timePart}`)
}

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
			formatted: parseDate(event.event_date).toLocaleTimeString('ru-RU'),
		}
	})
}
