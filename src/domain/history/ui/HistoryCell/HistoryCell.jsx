import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { RED_NUMBERS } from '@/shared/constants'
import { useRouletteSelector } from '@/shared/model'
import {
	selectHistoryCell,
	selectSpinCount,
} from '@/domain/history/model/selectors'

const getColor = number => {
	if (number === 0) return 'green'
	return RED_NUMBERS.has(number) ? 'red' : 'black'
}

export default function HistoryCell() {
	const historyCell = useRouletteSelector(selectHistoryCell)
	const spinCount = useRouletteSelector(selectSpinCount)
	const containerRef = useRef(null)
	const prevFirstRef = useRef(historyCell[0]?.number)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const items = container.querySelectorAll('.roulette__history-item')
		if (!items.length) return

		if (spinCount === prevFirstRef.current) return
		prevFirstRef.current = spinCount

		const itemHeight = 65.4

		gsap.set(container, { y: -itemHeight })

		gsap.to(container, {
			y: 0,
			duration: 1,
			delay: 0.4,
			ease: 'power2.out',
		})
	}, [historyCell, spinCount])

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
