import React, { memo } from 'react'
import { useStatisticStore } from '@/domain/statistic'

const StatCellLevel = memo(
	({ level }) => (
		<div
			className='statistic__cell statistic__cell--level'
			style={{ '--level-cell': `${level}%` }}
		></div>
	),
	(prev, next) => prev.level === next.level,
)

const StatCellNumber = memo(() => (
	<div className='statistic__cell'></div>
))

export default function Statistic() {
	const arrInfo = useStatisticStore(state => state.arrInfo)

	return (
		<div className='statistic'>
			<img
				className='statistic__img'
				src='/img/bg-statistic-and-last-events.png'
			/>
			<img className='statistic__img' src='/img/bg-statistic.png' />
			<div className='statistic__grid'>
				<div className='statistic__item'>
					{arrInfo.map(item => (
						<StatCellLevel key={item.id} level={item.level} />
					))}
				</div>
				<div className='statistic__item'>
					{arrInfo.map(item => (
						<StatCellNumber key={item.id} />
					))}
				</div>
			</div>
		</div>
	)
}
