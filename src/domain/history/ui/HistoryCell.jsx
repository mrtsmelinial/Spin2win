import React, { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { RED_NUMBERS } from '@/shared/constants'
import { useHistoryStore } from '@/domain/history/model/store'

const getColor = number => {
	if (number === 0) return 'green'
	return RED_NUMBERS.has(number) ? 'red' : 'black'
}

export default function HistoryCell() {
	const historyCell = useHistoryStore(state => state.historyCell)
	const spinCount = useHistoryStore(state => state.spinCount)
	const containerRef = useRef(null)
	const prevFirstRef = useRef(spinCount)
	const prevLastRef = useRef(null) 
	const [extraItem, setExtraItem] = useState(null) 

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container || historyCell.length === 0) return

		if (spinCount === prevFirstRef.current) return
		prevFirstRef.current = spinCount


		setExtraItem(prevLastRef.current)

		const itemHeight = 65.4
		gsap.set(container, { y: -itemHeight })
		gsap.to(container, {
			y: 0,
			duration: 1,
			ease: 'power2.out',
			onComplete: () => {
				setExtraItem(null)
			},
		})
	}, [historyCell])

	useLayoutEffect(() => {
		if (historyCell.length > 0) {
			prevLastRef.current = historyCell[historyCell.length - 1]
		}
	}, [historyCell])

	const displayItems = extraItem ? [...historyCell, extraItem] : historyCell

	return (
		<div className='history-cell__wrapper'>
			<div className='history-cell' ref={containerRef}>
				{displayItems.map((item, index) => (
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
