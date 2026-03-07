import { wheelSlots } from '@/shared/constants'

const createRandomCell = () => {
	const keys = Object.keys(wheelSlots)
	const randomKey = keys[Math.floor(Math.random() * keys.length)]
	return {
		number: Number(randomKey),
		...wheelSlots[randomKey],
	}
}
export default createRandomCell
