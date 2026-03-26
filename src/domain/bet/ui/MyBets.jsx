import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useClickSound } from '@/shared/model'
import gsap from 'gsap'
import {
	handleReady,
	toggleDialog,
	useBetStore,
	useMyBetsStore,
} from '../model/store'
import { useUserBetsHistory } from '../model/useUserBetsHistory'
import { useDrawStore } from '@/domain/draw'
import { useRoundStore } from '@/domain/round/model'

const HEADERS = ['date', 'round', 'result', 'bets', 'amount', 'win']
const BET_COLUMNS = ['bets', 'status', 'combination', 'amount', 'odds', 'win']

export default function MyBets() {
	const myBetsOverlayRef = useRef(null)
	const myBetsRef = useRef(null)
	const [expandedId, setExpandedId] = useState(null)
	const { fetchUserBetsHistory } = useUserBetsHistory()
	const bets = useMyBetsStore(state => state.bets)
	const billInfo = useBetStore(state => state.billInfo)
	const nextRound = useRoundStore(state => state.nextRound) 
	const phase = useDrawStore(state => state.phase)

	const precision = billInfo.precision

	const isOpen = useMyBetsStore(state => state.isOpen)
	const isReady = useMyBetsStore(state => state.isReady)
	const { playSound } = useClickSound()

	const handleToggle = useCallback(
		betId => {
			setExpandedId(expandedId === betId ? null : betId)
		},
		[expandedId],
	)

	const renderedBets = useMemo(() => {
		return bets
			.filter(bet => {
				if (bet.round === String(nextRound) && phase !== 'WINNERS') {
					return false
				}
				return true
			})
			.map(bet => (
				<BetRow
					key={bet.id}
					bet={bet}
					isExpanded={expandedId === bet.id}
					onToggle={() => handleToggle(bet.id)}
					precision={precision}
				/>
			))
	}, [bets, expandedId, handleToggle, precision, nextRound, phase])

	useEffect(() => {
		if (isOpen) {
			fetchUserBetsHistory()
		}
	}, [isOpen])

	useEffect(() => {
		if (!myBetsOverlayRef.current || !myBetsRef.current) return

		if (isOpen) {
			gsap.fromTo(
				myBetsOverlayRef.current,
				{ autoAlpha: 0 },
				{ autoAlpha: 1, duration: 0.3, ease: 'power2.out' },
			)
			gsap.fromTo(
				myBetsRef.current,
				{ autoAlpha: 0, scale: 0.8 },
				{ autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
			)
		} else {
			gsap.to(myBetsOverlayRef.current, {
				autoAlpha: 0,
				duration: 0.3,
				ease: 'power2.out',
			})
			gsap.to(myBetsRef.current, {
				autoAlpha: 0,
				scale: 0.8,
				duration: 0.3,
				ease: 'power2.out',

				onComplete: () => {
					handleReady(false)
				},
			})
		}
	}, [isOpen])

	return (
		<div className={`mybets__wrapper ${!isOpen && 'hidden'}`}>
			<div
				className='mybets__overlay'
				ref={myBetsOverlayRef}
				onClick={toggleDialog}
			></div>
			<div
				className='mybets'
				ref={myBetsRef}
				onClick={el => el.stopPropagation()}
			>
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
							toggleDialog()
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
				{!isReady && (
					<div className='mybets__load'>
						<svg
							aria-hidden='true'
							viewBox='0 0 100 101'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								className='mybets__load-cercle'
								d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
							></path>
							<path
								className='mybets__load-arc'
								d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
							></path>
						</svg>
					</div>
				)}
			</div>
		</div>
	)
}

const BetRow = React.memo(
	function BetRow({ bet, isExpanded, onToggle, precision }) {
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
						{item.amount.toFixed(precision).replace('.', ',')}
					</div>
					<div className='mybets__detalis-cell'>x{item.odds}</div>
					<div className='mybets__detalis-cell'>
						{item.win.toFixed(precision).replace('.', ',')}
					</div>
				</div>
			))
		}, [bet.details, precision])

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
					<div className='mybets__item-cell'>#{bet.round}</div>
					<div className='mybets__item-cell'>
						<div
							className={`mybets__result-digit mybets__result-digit--${bet.result.color}`}
						>
							{bet.result.number}
						</div>
					</div>
					<div className='mybets__item-cell'>{bet.bets}</div>
					<div className='mybets__item-cell'>
						{bet.amount.toFixed(precision).replace('.', ',')}
					</div>
					<div className='mybets__item-cell'>
						{bet.win.toFixed(precision).replace('.', ',')}
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
