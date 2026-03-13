import React from 'react'
import { useStatisticStore } from '@/domain/statistic'

export default function Statistic() {
	
	const arrInfo = useStatisticStore(state => state.arrInfo)
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
