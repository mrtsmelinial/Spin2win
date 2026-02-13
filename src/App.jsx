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

export default function App() {
	const arrInfo = createArrayInfo()
	console.log(arrInfo.length)

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
					<table className='roulette__stat-table'>
						<tr className='roulette__stat-item '>
							{arrInfo.map(item => (
								<td
									className='roulette__stat-cell roulette__stat-cell--level'
									key={`level-${item.id}`}
									style={{ '--level-cell': `${item.level}%` }}
								></td>
							))}
						</tr>
						<tr className='roulette__stat-item'>
							{arrInfo.map(item => (
								<td
									className='roulette__stat-cell roulette__stat-cell--number'
									key={item.id}
								></td>
							))}
						</tr>
					</table>
				</header>
			</div>
		</main>
	)
}
