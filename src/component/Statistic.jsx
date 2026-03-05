import React, { useEffect, useState } from 'react'
import { selectLastResult } from '../selectors/rouletteSelectors'
import { useRouletteSelector } from '../context/useRoulette'


function createArrayInfo() {
	const arr = []
	let total = 0

	for (let i = 0; i < 37; i++) {
		const level = Math.random()
		arr.push({ id: i, level })
		total += level
	}

	return arr.map(item => ({
		...item,
		level: Math.round((item.level / total) * 300),
	}))
}

export default function Statistic() {
	const [arrInfo, setArrInfo] = useState(createArrayInfo)
	const lastResult = useRouletteSelector(selectLastResult)

	useEffect(() => {
		if (lastResult !== null) {
			setTimeout(() => {
				setArrInfo(prev => {
					const updated = prev.map(item => ({
						...item,
						level:
							item.id === lastResult.number
								? item.level + 1
								: Math.max(0, item.level - 1),
					}))

					const total = updated.reduce((sum, item) => sum + item.level, 0)

					return updated.map(item => ({
						...item,
						level: total > 0 ? Math.round((item.level / total) * 300) : 0,
					}))
				})
			}, 0)
		}
	}, [lastResult])

	return (
		<div className='roulette__statistic'>
			<img
				className='roulette__stat-img roulette__stat-img--wrapper'
				src='../img/bg-statistic-and-last-events.png'
			/>
			<img
				className='roulette__stat-img roulette__stat-img--level'
				src='../img/bg-statistic.png'
			/>
			<div className='roulette__stat-grid'>
				<div className='roulette__stat-item'>
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
		</div>
	)
}
