import React from 'react'

function createArrayInfo() {
	const arr = []

	for (let i = 0; i < 37; i++) {
		arr.push({
			id: i,
			level: i,
		})
	}

	return arr
}

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

export default function App() {
	const arrInfo = createArrayInfo()


	return (
		<main className='roulette'>
			<div className='roulette__container'>
				<header className='roulette__stat'>
					<img
						className='roulette__stat-img roulette__stat-img--wrapper'
						src='../img/bg-statistic-and-last-events.png'
					/>
					<img
						className='roulette__stat-img roulette__stat-img--level'
						src='../img/bg-statistic.png'
					/>
					<div className='roulette__stat-grid'>
						<div className='roulette__stat-item '>
							{arrInfo.map(item => (
								<div
									className='roulette__stat-cell roulette__stat-cell--level'
									key={`level-${item.id}`}
									style={{ '--level-cell': `${item.level}%` }}
								></div>
							))}
						</div>
						<div className='roulette__stat-item'>
							{arrInfo.map(item => (
								<div
									className='roulette__stat-cell roulette__stat-cell--number'
									key={item.id}
								></div>
							))}
						</div>
					</div>
				</header>
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
			</div>
		</main>
	)
}
