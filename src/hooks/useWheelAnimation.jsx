import { useRef } from 'react'
import gsap from 'gsap'
import { getCellByRotation } from '../utils/wheelUtils'
import { getCellRandom } from '../reducers/CreateRandomCell'
import { TIME_BETTING } from '../constants/rouletteConstants'

export function useWheelAnimation({
	wheelRef,
	progressRef,
	playSoundRef,
	pointerRef,
	initialAngle,
	onSlotChange,
	setCellRandom,
	targetCellRef,
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
						rotation: -40,
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
