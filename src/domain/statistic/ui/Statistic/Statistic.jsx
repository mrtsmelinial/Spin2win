import React, { memo } from 'react'
import { useStatisticStore } from '@/domain/statistic'

const StatCellLevel = memo(
	({ level }) => (
		<div
			className='roulette__stat-cell roulette__stat-cell--level'
			style={{ '--level-cell': `${level}%` }}
		></div>
	),
	(prev, next) => prev.level === next.level,
)

const StatCellNumber = memo(() => (
	<div className='roulette__stat-cell roulette__stat-cell--number'></div>
))

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
						<StatCellLevel key={item.id} level={item.level} />
					))}
				</div>
				<div className='roulette__stat-item'>
					{arrInfo.map(item => (
						<StatCellNumber key={item.id} />
					))}
				</div>
			</div>
		</div>
	)
}
