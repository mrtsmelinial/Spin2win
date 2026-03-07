import { useRef } from 'react'
import gsap from 'gsap'
import { getCellByRotation } from '@/domain/roulette/lib'
import { TIME_BETTING } from '@/domain/roulette/config/timeBetting'

export function useWheelAnimation({
	wheelRef,
	progressRef,
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

	function startTimer(onTimerEnd) {
		const path = progressRef.current
		const length = path.getTotalLength()

		gsap.killTweensOf(path)
		gsap.set(path, {
			strokeDasharray: length,
			strokeDashoffset: 0,
			opacity: 1,
		})

		gsap.to(path, {
			strokeDashoffset: length,
			duration: TIME_BETTING,
			ease: 'none',
			delay: 2,
			onComplete: () => {
				gsap.set(path, { opacity: 0 })
				onTimerEnd()
			},
		})
	}

	return { init, handleSlotUpdate, startTimer }
}
