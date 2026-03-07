import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { RED_NUMBERS } from '@/shared/constants'
import {
	selectHistoryCell,
	selectSpinCount,
} from '@/domain/history/model/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { historyTrimLast } from '@/domain/history/model/reducer'

const getColor = number => {
	if (number === 0) return 'green'
	return RED_NUMBERS.has(number) ? 'red' : 'black'
}

export default function HistoryCell() {
	const historyCell = useSelector(selectHistoryCell)
	const spinCount = useSelector(selectSpinCount)
	const dispatch = useDispatch()
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
				dispatch(historyTrimLast())
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
