import { wheelSlots } from "../component/WheelSlots"


export const colorSrcMap = {
  red: '/img/roulette-num-red-center.svg',
  black: '/img/roulette-num-black-center.svg',
  green: '/img/roulette-num-green-center.svg',
}

export const getColorImgSrc = color => colorSrcMap[color] ?? null

export const getCellByRotation = rotation => {
		const normalized = ((rotation % 360) + 360) % 360

		let closestKey = null
		let minDiff = Infinity

		Object.keys(wheelSlots).forEach(k => {
			const slotAngle = wheelSlots[k].angle
			let diff = Math.abs(normalized - slotAngle)
			if (diff > 180) diff = 360 - diff

			if (diff < minDiff) {
				minDiff = diff
				closestKey = k
			}
		})

		if (closestKey === null) return null

		return {
			number: Number(closestKey),
			...wheelSlots[closestKey],
		}
	}