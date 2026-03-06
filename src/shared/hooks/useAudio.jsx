import { useEffect, useRef } from 'react'

export default function useAudio(src, poolSize = 8) {
	const audioPoolRef = useRef([])
	const audioIndexRef = useRef(0)
	const lastPlayTimeRef = useRef(0)

	useEffect(() => {
		audioPoolRef.current = Array.from({ length: poolSize }, () => {
			const audio = new Audio(src)
			audio.volume = 0.5
			return audio
		})
	}, [src, poolSize])

	const playClick = () => {
		const now = performance.now()

		if (now - lastPlayTimeRef.current < 30) return

		lastPlayTimeRef.current = now

		const pool = audioPoolRef.current
		const index = audioIndexRef.current

		pool[index].currentTime = 0
		pool[index].play()

		audioIndexRef.current = (index + 1) % pool.length
	}

	return playClick
}
