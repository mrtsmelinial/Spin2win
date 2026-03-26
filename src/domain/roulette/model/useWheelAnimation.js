import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePointerAnimation } from './usePointerAnimation'
import { useDrawTimer } from '@/domain/draw'

const MAX_WAIT_LOOPS = 15

export function useWheelAnimation({
	wheelRef,
	progressRef,
	playSoundRef,
	pointerRef,
	initialAngle,
	onSlotChange,
	onWaitTimeout,
}) {
	const targetCellRef = useRef(null)

	const { init, handleSlotUpdate } = usePointerAnimation({
		wheelRef,
		playSoundRef,
		pointerRef,
		initialAngle,
		onSlotChange,
	})

	const { startTimer } = useDrawTimer({ progressRef })

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

	function SpinWait(setTarget, onComplete) {
		let loopCount = 0
		let stopped = false

		setTarget.resolve = cell => {
			targetCellRef.current = cell
			stopped = true
		}

		function loop() {
			if (stopped) {
				onComplete()
				return
			}

			if (loopCount >= MAX_WAIT_LOOPS) {
				onWaitTimeout?.()
				return
			}

			loopCount++
			const currentRotation = gsap.getProperty(wheelRef.current, 'rotation')

			gsap.to(wheelRef.current, {
				rotation: currentRotation + 360,
				duration: 1,
				ease: 'linear',
				onUpdate: handleSlotUpdate,
				onComplete: loop,
			})
		}

		loop()
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

	function tickGSAPWhileHidden(value) {
		if (value === false) {
			document.removeEventListener('visibilitychange', tickGSAPWhileHidden.fn)
			clearInterval(tickGSAPWhileHidden.id)
			return
		}

		const onChange = () => {
			clearInterval(tickGSAPWhileHidden.id)
			if (document.hidden) {
				gsap.ticker.lagSmoothing(0)
				tickGSAPWhileHidden.id = window.setInterval(gsap.ticker.tick, 500)
			} else {
				gsap.ticker.lagSmoothing(500, 33)
			}
		}

		document.addEventListener('visibilitychange', onChange)
		tickGSAPWhileHidden.fn = onChange
		onChange()
	}

	tickGSAPWhileHidden.id = undefined
	tickGSAPWhileHidden.fn = undefined

	useEffect(() => {
		tickGSAPWhileHidden(true)
		return () => {
			tickGSAPWhileHidden(false)
		}
	}, [])

	return { init, startTimer, SpinStart, SpinWait, SpinToCell }
}

