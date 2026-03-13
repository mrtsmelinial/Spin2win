import { createInitialBets } from '@/shared/lib'
import { useMemo } from 'react'
import { useStatisticStore } from '../../model/store'
import NumberFlow from '@number-flow/react'

export default function StatisticSection() {
	const bets = createInitialBets()
	const arrInfo = useStatisticStore(state => state.arrInfo)
	const arrExtra = useStatisticStore(state => state.arrExtra)

	const numberCell = useMemo(
		() => bets.filter(bet => bet.type === 'number'),
		[bets],
	)

	const parityCell = useMemo(
		() => bets.filter(bet => bet.type === 'parity'),
		[bets],
	)

	const colorCell = useMemo(
		() => bets.filter(bet => bet.type === 'color'),
		[bets],
	)

	const rangeCell = useMemo(
		() => bets.filter(bet => bet.type === 'range'),
		[bets],
	)

	const dozenCell = useMemo(
		() => bets.filter(bet => bet.type === 'dozen'),
		[bets],
	)

	const sectionCell = useMemo(
		() => bets.filter(bet => bet.type === 'section'),
		[bets],
	)

	return (
		<div className='roulette__menu-statistic'>
			<div className='roulette__menu-graph'>
				{numberCell.map((item, index) => (
					<div className='roulette__graph-item' key={index}>
						<div className='roulette__graph-scale'>
							<div
								className={`roulette__scale-level roulette__scale-level--${item.color}`}
								style={{
									'--level-cell': `${arrInfo.find(el => el.id === item.value)?.level ?? 0}%`,
								}}
							></div>
						</div>
						<div className='roulette__graph-number'>{item.value}</div>
					</div>
				))}
			</div>
			<div className='roulette__menu-draw-container'>
				<div className='roulette__menu-cell-grid'>
					<div className='roulette__cell-main'>
						{numberCell
							.filter(item => item.value !== 0)
							.map((item, index) => (
								<div className='roulette__menu-cell' key={index}>
									<div
										className={`roulette__menu-cell-number roulette__menu-cell-number--${item.color}`}
									>
										{item.value}
									</div>
									<div className='roulette__menu-cell-level'>
										<NumberFlow
											value={
												arrInfo.find(el => el.id === item.value)?.count ?? 0
											}
										/>
									</div>
								</div>
							))}
					</div>
					<div className='roulette__cell-zero'>
						<div className='roulette__menu-cell'>
							<div className='roulette__menu-cell-number roulette__menu-cell-number--green'>
								0
							</div>
							<div className='roulette__menu-cell-level'>
								<NumberFlow
									value={arrInfo.find(el => el.id === 0)?.count ?? 0}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className='roulette__menu-add-grid'>
					<div className='roulette__menu-add-cells'>
						{parityCell.map((item, index) => (
							<div className='roulette__menu-add-cell' key={index}>
								<div className='roulette__menu-add-cell-title'>
									{item.value}
								</div>
								<div className='roulette__menu-cell-level'>
									<NumberFlow
										value={arrExtra.find(el => el.id === item.id)?.count ?? 0}
									/>
								</div>
							</div>
						))}
						{colorCell.map((item, index) => (
							<div className='roulette__menu-add-cell' key={index}>
								<div
									className={`roulette__menu-add-cell-title roulette__menu-add-cell-title--${item.value}`}
								>
									{item.value}
								</div>
								<div className='roulette__menu-cell-level'>
									<NumberFlow
										value={arrExtra.find(el => el.id === item.id)?.count ?? 0}
									/>
								</div>
							</div>
						))}
					</div>
					<div className='roulette__menu-add-cells roulette__menu-add-cells--size3'>
						{dozenCell.map((item, index) => (
							<div className='roulette__menu-add-cell' key={index}>
								<div className='roulette__menu-add-cell-title'>
									{item.value[0]}-{item.value[1]}
								</div>
								<div className='roulette__menu-cell-level'>
									<NumberFlow
										value={arrExtra.find(el => el.id === item.id)?.count ?? 0}
									/>
								</div>
							</div>
						))}
					</div>
					<div className='roulette__menu-add-cells roulette__menu-add-cells--center '>
						{rangeCell.map((item, index) => (
							<div className='roulette__menu-add-cell' key={index}>
								<div className='roulette__menu-add-cell-title'>
									{item.value[0]}-{item.value[1]}
								</div>
								<div className='roulette__menu-cell-level'>
									<NumberFlow
										value={arrExtra.find(el => el.id === item.id)?.count ?? 0}
									/>
								</div>
							</div>
						))}
					</div>
					<div className='roulette__menu-add-cells roulette__menu-add-cells--size6'>
						{sectionCell.map((item, index) => (
							<div className='roulette__menu-add-cell' key={index}>
								<div className='roulette__menu-add-cell-title'>
									{item.value}
								</div>
								<div className='roulette__menu-cell-level'>
									<NumberFlow
										value={
											arrExtra.find(
												el => el.id === `section-${item.value.toLowerCase()}`,
											)?.count ?? 0
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
