import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useClickSound } from '@/shared/model'
import gsap from 'gsap'
import { closeDialog, useMyBetsStore } from '../../model/store'

const HEADERS = ['date', 'round', 'result', 'bets', 'amount', 'win']
const BET_COLUMNS = ['bets', 'status', 'combination', 'amount', 'odds', 'win']

export default function MyBets() {
	const myBetsRef = useRef(null)
	const [expandedId, setExpandedId] = useState(null)
	const bets = useMyBetsStore(state => state.bets)

	const isOpen = useMyBetsStore(state => state.isOpen)
	const { playSound } = useClickSound()

	const handleToggle = useCallback(
		betId => {
			setExpandedId(expandedId === betId ? null : betId)
		},
		[expandedId],
	)

	const renderedBets = useMemo(() => {
		return bets.map(bet => (
			<BetRow
				key={bet.id}
				bet={bet}
				isExpanded={expandedId === bet.id}
				onToggle={() => handleToggle(bet.id)}
			/>
		))
	}, [bets, expandedId, handleToggle])

	useEffect(() => {
		if (!myBetsRef) return

		if (isOpen) {
			gsap.fromTo(
				myBetsRef.current,
				{
					display: 'flex',
					opacity: 0,
					scale: 0.9,
				},
				{
					opacity: 1,
					scale: 1,
					duration: 0.3,
					ease: 'power2.out',
				},
			)
		} else {
			gsap.to(myBetsRef.current, {
				display: 'none',
				opacity: 0,
				scale: 0.9,
				duration: 0.3,
				ease: 'power2.out',
			})
		}
	}, [isOpen])

	return (
		<div className='mybets__overlay' ref={myBetsRef} onClick={closeDialog}>
			<div className='mybets' onClick={el => el.stopPropagation()}>
				<header className='mybets__header'>
					<ul className='mybets__header-list'>
						{HEADERS.map(item => (
							<li className='mybets__header-item' key={item}>
								<span>{item}</span>
							</li>
						))}
					</ul>
					<button
						className='mybets__button-close'
						type='button'
						onClick={() => {
							closeDialog()
							playSound('button')
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							fill='none'
							viewBox='0 0 24 24'
						>
							<path
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M6 18 17.94 6M18 18 6.06 6'
							></path>
						</svg>
					</button>
				</header>
				<div className='mybets__content'>
					{bets.length === 0 ? (
						<p className='mybets__list-text'>You haven't placed any bets yet</p>
					) : (
						<div className='mybets__list'>{renderedBets}</div>
					)}
				</div>
			</div>
		</div>
	)
}

const BetRow = React.memo(
	function BetRow({ bet, isExpanded, onToggle }) {
		const { playSound } = useClickSound()
		const detailsRef = useRef(null)

		const handleClick = useCallback(() => {
			onToggle()
			playSound('button')
		}, [onToggle, playSound])

		const detailsRows = useMemo(() => {
			return bet.details?.map((item, index) => (
				<div className='mybets__detalis-row' key={index}>
					<div className='mybets__detalis-cell'>
						<span className='mybets__detalis-id'>{index + 1}</span>
						<span className='mybets__detalis-id-secondary'>(ID {item.id})</span>
					</div>
					<div className='mybets__detalis-cell'>{item.status}</div>
					<div className='mybets__detalis-cell mybets__detalis-cell--up'>
						{item.combination}
					</div>
					<div className='mybets__detalis-cell'>
						{item.amount.toFixed(2).replace('.', ',')}
					</div>
					<div className='mybets__detalis-cell'>{item.odds}</div>
					<div className='mybets__detalis-cell'>
						{item.win.toFixed(2).replace('.', ',')}
					</div>
				</div>
			))
		}, [bet.details])

		useEffect(() => {
			if (!detailsRef.current) return

			if (isExpanded) {
				const scrollHeight = detailsRef.current.scrollHeight
				gsap.to(detailsRef.current, {
					opacity: 1,
					duration: 0.2,
					ease: 'power2.out',
				})
				gsap.to(detailsRef.current, {
					height: scrollHeight,
					duration: 0.5,
					ease: 'power1.out',
				})
			} else {
				gsap.to(detailsRef.current, {
					height: 0,
					opacity: 0,
					duration: 0.2,
					ease: 'power1.out',
				})
			}
		}, [isExpanded])

		return (
			<>
				<button
					className={`mybets__item ${isExpanded && 'active'}`}
					type='button'
					onClick={handleClick}
				>
					<svg
						className='mybets__marker'
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						fill='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							fillRule='evenodd'
							d='M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z'
							clipRule='evenodd'
						></path>
					</svg>
					<div className='mybets__item-cell'>{bet.date}</div>
					<div className='mybets__item-cell'>{bet.round}</div>
					<div className='mybets__item-cell'>
						<div
							className={`mybets__result-digit mybets__result-digit--${bet.result.color}`}
						>
							{bet.result.number}
						</div>
					</div>
					<div className='mybets__item-cell'>{bet.bets}</div>
					<div className='mybets__item-cell'>
						{bet.amount.toFixed(2).replace('.', ',')}
					</div>
					<div className='mybets__item-cell'>
						{bet.win.toFixed(2).replace('.', ',')}
					</div>
				</button>
				<div className='mybets__detalis' ref={detailsRef}>
					<div className='mybets__detalis-header'>
						{BET_COLUMNS.map(item => (
							<div className='mybets__detalis-header-item' key={item}>
								{item}
							</div>
						))}
					</div>
					{detailsRows}
				</div>
			</>
		)
	},
	(prevProps, nextProps) => {
		return (
			prevProps.bet === nextProps.bet &&
			prevProps.isExpanded === nextProps.isExpanded &&
			prevProps.onToggle === nextProps.onToggle
		)
	},
)
