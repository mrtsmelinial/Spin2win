import { wheelSlots } from '@/shared/lib'

const getCellRandom = () => {
	const keys = Object.keys(wheelSlots)
	const randomKey = keys[Math.floor(Math.random() * keys.length)]
	return {
		number: Number(randomKey),
		...wheelSlots[randomKey],
	}
}
export default getCellRandom
