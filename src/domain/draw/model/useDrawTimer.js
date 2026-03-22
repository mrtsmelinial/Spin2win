import gsap from 'gsap'

export default function useBettingTImer({ progressRef}) {
	function startTimer(onTimerEnd, duration) {
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
			duration,
			ease: 'none',
			onComplete: () => {
				gsap.set(path, { opacity: 0 })
				onTimerEnd()
			},
		})
	}

	return { startTimer }
}
