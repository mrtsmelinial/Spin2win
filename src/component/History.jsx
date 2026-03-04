import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function History({ history }) {
	const containerRef = useRef(null)
	const prevFirstRef = useRef(history[0]?.number)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const items = container.querySelectorAll('.roulette__history-item')
		if (!items.length) return

		if (history[0]?.number === prevFirstRef.current) return
		prevFirstRef.current = history[0]?.number

		const itemHeight = 38.1

		gsap.set(container, { y: -itemHeight })

		gsap.to(container, {
			y: 0,
			duration: 1,
			ease: 'power1.out',
		})
	}, [history])

	const getColor = number => {
		const redNumbers = new Set([
			1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
		])
		if (number === 0) return 'green'
		return redNumbers.has(number) ? 'red' : 'black'
	}

	return (
		<div className='roulette__history-wrapper'>
			<div className='roulette__history' ref={containerRef}>
				{history.map((item, index) => (
					<div
						className='roulette__history-item'
						key={`${item.number}-${index}`}
						style={{
							backgroundColor: `var(--color-${getColor(item.number)})`,
						}}
					>
						<span className='roulette__history-number'>{item.number}</span>
					</div>
				))}
			</div>
		</div>
	)
}
