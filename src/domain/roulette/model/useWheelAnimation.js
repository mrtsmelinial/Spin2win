import { useRef } from 'react'
import gsap from 'gsap'
import { getCellByRotation } from '@/domain/roulette/lib'

export function useWheelAnimation({
	wheelRef,
	playSoundRef,
	pointerRef,
	initialAngle,
	onSlotChange,
}) {
	const prevCellRef = useRef(null)

	function init() {
		gsap.set(wheelRef.current, { rotation: initialAngle })
	}

	const handleSlotUpdate = () => {
		const rotation = gsap.getProperty(wheelRef.current, 'rotation') % 360
		const currentSlot = getCellByRotation(rotation)
		if (currentSlot) {
			if (currentSlot.number !== prevCellRef.current) {
				prevCellRef.current = currentSlot.number
				playSoundRef.current('click')
				gsap.fromTo(
					pointerRef.current,
					{ rotation: 0 },
					{
						rotation: -30,
						duration: 0.1,
						ease: 'power1.out',
						yoyo: true,
						repeat: 1,
					},
				)
			}
			onSlotChange(currentSlot)
		}
	}

	

	return { init, handleSlotUpdate }
}
