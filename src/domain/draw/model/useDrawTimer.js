import gsap from 'gsap'
import React from 'react'
import { TIME_BETTING } from '../config/timeBetting'

export default function useBettingTImer({ progressRef }) {

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

	return {startTimer}
}
