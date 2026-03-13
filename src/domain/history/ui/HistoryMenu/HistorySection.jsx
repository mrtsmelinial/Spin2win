import { useHistoryStore } from '../../model/store'
import { useShallow } from 'zustand/react/shallow'


export default function HistorySection() {
	const historyCell = useHistoryStore(
		useShallow(state => state.historyCell.slice(0, 10)),
	)

	return (
		<div className='roulette__menu-history'>
			<ul className='roulette__menu-list roulette__menu-list--history'>
				<li className='roulette__menu-item roulette__menu-item--history'>
					<div className='roulette__item-time'>time</div>
					<div className='roulette__item-round'>draw</div>
					<div className='roulette__item-result'></div>
				</li>
				{historyCell.map((item, index) => (
					<li
						className='roulette__menu-item roulette__menu-item--history'
						key={index}
					>
						<div className='roulette__item-time'>
							{item.formatted}
						</div>
						<div className='roulette__item-round'>
							{item.round?.toLocaleString('ru-RU')}
						</div>
						<div className='roulette__item-result'>
							<div
								className={`roulette__item-cell roulette__item-cell--${item.color}`}
							>
								{item.number}
							</div>
							<div className='roulette__item-sector'>{item.sector}</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
