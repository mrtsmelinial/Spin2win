import { createInitialBets } from '@/shared/lib'
import { useMemo } from 'react'
import { useStatisticStore } from '../../model/store'
import NumberFlow from '@number-flow/react'

const INITIAL_BETS = createInitialBets()

const numberCell = INITIAL_BETS.filter(bet => bet.type === 'number')
const parityCell = INITIAL_BETS.filter(bet => bet.type === 'parity')
const colorCell = INITIAL_BETS.filter(bet => bet.type === 'color')
const rangeCell = INITIAL_BETS.filter(bet => bet.type === 'range')
const dozenCell = INITIAL_BETS.filter(bet => bet.type === 'dozen')
const sectionCell = INITIAL_BETS.filter(bet => bet.type === 'section')

export default function StatisticSection() {
	const arrInfo = useStatisticStore(state => state.arrInfo)
	const arrExtra = useStatisticStore(state => state.arrExtra)

	const infoMap = useMemo(
		() => new Map(arrInfo.map(el => [el.id, el])),
		[arrInfo],
	)

	const extraMap = useMemo(
		() => new Map(arrExtra.map(el => [el.id, el])),
		[arrExtra],
	)

	return (
		<div>
			<div className='graph'>
				{numberCell.map((item, index) => (
					<div className='graph__item' key={index}>
						<div className='graph__scale'>
							<div
								className={`graph__level graph__level--${item.color}`}
								style={{
									'--level-cell': `${infoMap.get(item.value)?.level ?? 0}%`,
								}}
							></div>
						</div>
						<div className='graph__number'>{item.value}</div>
					</div>
				))}
			</div>
			<div className='statistic-expandet'>
				<div>
					<div className='statistic-expandet__cells'>
						{numberCell
							.filter(item => item.value !== 0)
							.map((item, index) => (
								<div className='statistic-expandet__cell' key={index}>
									<div
										className={`statistic-expandet__number statistic-expandet__number--${item.color}`}
									>
										{item.value}
									</div>
									<div className='statistic-expandet__level'>
										<NumberFlow value={infoMap.get(item.value)?.count ?? 0} />
									</div>
								</div>
							))}
					</div>
					<div className='statistic-expandet__zero'>
						<div className='statistic-expandet__cell'>
							<div className='statistic-expandet__number statistic-expandet__number--green'>
								0
							</div>
							<div className='statistic-expandet__level'>
								<NumberFlow value={infoMap.get(0)?.count ?? 0} />
							</div>
						</div>
					</div>
				</div>
				<div className='statistic-expandet__add'>
					<div className='statistic-expandet__cells-add'>
						{parityCell.map((item, index) => (
							<div className='statistic-expandet__cell-add' key={index}>
								<div className='statistic-expandet__add-title'>
									{item.value}
								</div>
								<div className='statistic-expandet__level'>
									<NumberFlow value={extraMap.get(item.id)?.count ?? 0} />
								</div>
							</div>
						))}
						{colorCell.map((item, index) => (
							<div className='statistic-expandet__cell-add' key={index}>
								<div
									className={`statistic-expandet__add-title statistic-expandet__add-title--${item.value}`}
								>
									{item.value}
								</div>
								<div className='statistic-expandet__level'>
									<NumberFlow value={extraMap.get(item.id)?.count ?? 0} />
								</div>
							</div>
						))}
					</div>
					<div className='statistic-expandet__cells-add statistic-expandet__cells-add--size3'>
						{dozenCell.map((item, index) => (
							<div className='statistic-expandet__cell-add' key={index}>
								<div className='statistic-expandet__add-title'>
									{item.value[0]}-{item.value[1]}
								</div>
								<div className='statistic-expandet__level'>
									<NumberFlow value={extraMap.get(item.id)?.count ?? 0} />
								</div>
							</div>
						))}
					</div>
					<div className='statistic-expandet__cells-add statistic-expandet__cells-add--center '>
						{rangeCell.map((item, index) => (
							<div className='statistic-expandet__cell-add' key={index}>
								<div className='statistic-expandet__add-title'>
									{item.value[0]}-{item.value[1]}
								</div>
								<div className='statistic-expandet__level'>
									<NumberFlow value={extraMap.get(item.id)?.count ?? 0} />
								</div>
							</div>
						))}
					</div>
					<div className='statistic-expandet__cells-add statistic-expandet__cells-add--size6'>
						{sectionCell.map((item, index) => (
							<div className='statistic-expandet__cell-add' key={index}>
								<div className='statistic-expandet__add-title'>
									{item.value}
								</div>
								<div className='statistic-expandet__level'>
									<NumberFlow
										value={
											extraMap.get(`section-${item.value.toLowerCase()}`)
												?.count ?? 0
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
