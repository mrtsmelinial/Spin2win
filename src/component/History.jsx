import React from 'react'

export default function History() {

  const redNumbers = new Set([
		1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
	])

	const rouletteData = Array.from({ length: 37 }, (_, i) => {
		let color

		if (i === 0) {
			color = 'g'
		} else if (redNumbers.has(i)) {
			color = 'r'
		} else {
			color = 'b'
		}

		return {
			number: i,
			color,
		}
	})

  return (
		<div className='roulette__history'>
			{rouletteData.slice(10, 20).map((item, index) => (
				<div
					className='roulette__history-item'
					key={index}
					style={{
						backgroundColor: `var(--cell-color-${item.color})`,
					}}
				>
					<span className='roulette__history-number'>{item.number}</span>
				</div>
			))}
		</div>
	)
}
