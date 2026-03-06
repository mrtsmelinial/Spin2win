import { useRef } from 'react'
import gsap from 'gsap'
import { getCellRandom } from '@/domain/utils'
import { useWheelAnimation } from './useWheelAnimation'

export function useDrawCycle({
	wheelRef,
	progressRef,
	playSoundRef,
	pointerRef,
	initialAngle,
	onSlotChange,
	setCellRandom,
}) {
	const targetCellRef = useRef(null)

	const { init, handleSlotUpdate, startTimer } = useWheelAnimation({
		wheelRef,
		progressRef,
		playSoundRef,
		pointerRef,
		initialAngle,
		onSlotChange,
	})

	function SpinStart(onComplete) {
		const currentRotation = gsap.getProperty(wheelRef.current, 'rotation')
		gsap.to(wheelRef.current, {
			rotation: currentRotation + 360 * 2,
			duration: 3,
			ease: 'power1.in',
			onUpdate: handleSlotUpdate,
			onComplete,
		})
	}

	function SpinWait(onComplete) {
		const currentRotation = gsap.getProperty(wheelRef.current, 'rotation')
		const newCell = getCellRandom()
		targetCellRef.current = newCell
		setCellRandom(newCell)

		gsap.to(wheelRef.current, {
			rotation: currentRotation + 360 * 3,
			duration: 2,
			ease: 'linear',
			onUpdate: handleSlotUpdate,
			onComplete,
		})
	}

	function SpinToCell(onComplete) {
		const target = targetCellRef.current
		const currentRotation = gsap.getProperty(wheelRef.current, 'rotation')

		const currentNormalized = ((currentRotation % 360) + 360) % 360
		let diff = target.angle - currentNormalized
		if (diff < 0) diff += 360

		gsap.to(wheelRef.current, {
			rotation: currentRotation + diff + 360 * 6,
			duration: 25,
			ease: 'power4.out',
			snap: { rotation: 0.1 },
			onUpdate: function () {
				const currentRot = gsap.getProperty(wheelRef.current, 'rotation')
				const targetRot = currentRotation + diff + 360 * 6
				if (this.progress() > 0.85 && Math.abs(currentRot - targetRot) < 0.5) {
					this.progress(1)
				}
				handleSlotUpdate()
			},
			onComplete: () => onComplete(target),
		})
	}

	return { init, startTimer, SpinStart, SpinWait, SpinToCell }
}
