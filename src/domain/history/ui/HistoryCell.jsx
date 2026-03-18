import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { RED_NUMBERS } from '@/shared/constants'
import { useHistoryStore, historyTrimLast } from '@/domain/history/model/store'
const getColor = number => {
	if (number === 0) return 'green'
	return RED_NUMBERS.has(number) ? 'red' : 'black'
}

export default function HistoryCell() {
	const historyCell = useHistoryStore(state => state.historyCell)
	const spinCount = useHistoryStore(state => state.spinCount)
	const containerRef = useRef(null)
	const prevFirstRef = useRef(spinCount)

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container) return

		if (spinCount === prevFirstRef.current) return
		prevFirstRef.current = spinCount

		const itemHeight = 65.4

		gsap.set(container, { y: -itemHeight })

		gsap.to(container, {
			y: 0,
			duration: 1,
			ease: 'power2.out',
			onComplete: () => {
				historyTrimLast()
			},
		})
	}, [historyCell])

	return (
		<div className='history-cell__wrapper'>
			<div className='history-cell' ref={containerRef}>
				{historyCell.map((item, index) => (
					<div
						className='history-cell__item'
						key={`${item.number}-${index}`}
						style={{
							backgroundColor: `var(--color-${getColor(item.number)})`,
						}}
					>
						<span className='history-cell__number'>{item.number}</span>
					</div>
				))}
			</div>
		</div>
	)
}
