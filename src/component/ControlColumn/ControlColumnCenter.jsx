import React, { useEffect, useRef } from 'react'
import SpinnerTimer from './SpinnerTimer'

export default function ControlColumnCenter() {
	const progressRef = useRef(null)
	const wheelRef = useRef(null)

	const startTimer = () => {
		const path = progressRef.current
		const duration = 15000
		const length = path.getTotalLength()

		path.style.transition = 'none'
		path.style.strokeDasharray = length
		path.style.strokeDashoffset = 0

		let startTime = null

		const animate = time => {
			if (!startTime) startTime = time
			const progress = time - startTime
			const percent = Math.min(progress / duration, 1)

			path.style.strokeDashoffset = length * percent

			if (percent < 1) {
				requestAnimationFrame(animate)
			} else {
				startSpin()
			}
		}

		requestAnimationFrame(animate)
	}

	const startSpin = () => {
		const wheel = wheelRef.current

		const spinDuration = 30000
		const extraSpins = 20

		const totalRotation = extraSpins * 360

		wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
		wheel.style.transform = `rotate(${totalRotation}deg)`

		wheel.addEventListener('transitionend', handleSpinEnd, {
			once: true,
		})
	}

	const handleSpinEnd = () => {
		const wheel = wheelRef.current

		const computedStyle = window.getComputedStyle(wheel)
		const matrix = new DOMMatrix(computedStyle.transform)
		const currentRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)

		wheel.style.transition = 'none'
		wheel.style.transform = `rotate(${currentRotation}deg)`

		setTimeout(() => {
			startTimer()
		}, 100)
	}

	useEffect(() => {
		startTimer()
	})

	return (
		<div className='roulette__control-center'>
			<div className='roulette__spinner-bg'>
				<div className='roulette__pointer'></div>
				<div className='roulette__spinner-wheel' ref={wheelRef}>
					<div className='roulette__spinner-num'></div>
				</div>
				<SpinnerTimer progressRef={progressRef} />
			</div>
		</div>
	)
}
