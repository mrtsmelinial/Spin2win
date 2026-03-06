import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { RED_NUMBERS } from '@/shared/constants'

const getColor = number => {
	if (number === 0) return 'green'
	return RED_NUMBERS.has(number) ? 'red' : 'black'
}

export default function HistoryCell({ historyCell }) {
	const containerRef = useRef(null)
	const prevFirstRef = useRef(historyCell[0]?.number)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const items = container.querySelectorAll('.roulette__history-item')
		if (!items.length) return

		if (historyCell[0]?.number === prevFirstRef.current) return
		prevFirstRef.current = historyCell[0]?.number

		const itemHeight = 65.4

		gsap.set(container, { y: -itemHeight })

		gsap.to(container, {
			y: 0,
			duration: 1,
			delay: 0.4,
			ease: 'power2.out',
		})
	}, [historyCell])

	return (
		<div className='roulette__history-wrapper'>
			<div className='roulette__history' ref={containerRef}>
				{historyCell.map((item, index) => (
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
