import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { RED_NUMBERS } from '@/shared/constants'
import { useRouletteSelector, useRouletteDispatch } from '@/shared/model'
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
	const dispatch = useRouletteDispatch()
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
				dispatch({ type: 'HISTORY_TRIM_LAST' })
			},
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
