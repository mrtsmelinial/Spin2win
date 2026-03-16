import { useHistoryStore } from '../../model/store'
import { useShallow } from 'zustand/react/shallow'


export default function HistorySection() {
	const historyCell = useHistoryStore(
		useShallow(state => state.historyCell.slice(0, 10)),
	)

	return (
		<div>
			<ul className='menu__list menu__list--history'>
				<li className='menu__item menu__item--history'>
					<div className='menu__time'>time</div>
					<div className='menu__round'>draw</div>
					<div className='menu__result'></div>
				</li>
				{historyCell.map((item, index) => (
					<li className='menu__item menu__item--history' key={index}>
						<div className='menu__time'>{item.formatted}</div>
						<div className='menu__round'>
							{item.round?.toLocaleString('ru-RU')}
						</div>
						<div className='menu__result'>
							<div className={`menu__cell menu__cell--${item.color}`}>
								{item.number}
							</div>
							<div className='menu__sector'>{item.sector}</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
