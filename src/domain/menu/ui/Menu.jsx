import React from 'react'
import { close, setActiveIndex, useMenuStore } from '../model/store'
import { useClickSound } from '@/shared/model'
import { HistorySection } from '@/domain/history'
import MyBets, { openDialog } from '@/domain/mybets'
import { StatisticSection } from '@/domain/statistic'

function CoefficientsSection() {
	const COEFFICIENT_TABLE = [
		{ title: '1 number', coef: 36 },
		{ title: 'zero (green)', coef: 36 },
		{ title: 'even / odd', coef: 2 },
		{ title: 'red / black', coef: 2 },
		{ title: 'half (1-18) / (19-36)', coef: 2 },
		{ title: 'dozen (1-12) / (13-24) / (25-36)', coef: 3 },
		{ title: 'sector (A, B, C, D, E, F)', coef: 6 },
	]

	return (
		<ul className='menu__list'>
			{COEFFICIENT_TABLE.map((item, index) => (
				<li className='menu__item' key={index}>
					<div className='menu__item-title'>{item.title}</div>
					<div className='menu__item-coef'>x{item.coef}</div>
				</li>
			))}
		</ul>
	)
}

function RulesSection() {
	return (
		<div className='menu__rules'>
			<div className='menu__rules-text'>
				<p>
					In the game «Spin to Win», the winning number is considered to be the
					slot in which the ball has stopped
				</p>
				<p>The winnings will be calculated according to the coefficients.</p>
				<p>
					Before the start of the next round, select any combintaion from the
					available ones and wait for the game to begin.
				</p>
			</div>
			<img src='/img/rules-wheel.svg' />
		</div>
	)
}

export function Menu() {
	const isOpen = useMenuStore(state => state.isOpen)
	const { playSound } = useClickSound()

	const NAV_SECTIONS = [
		{ title: 'coefficients', description: 'coefficients' },
		{ title: 'game rules', description: 'game rules' },
		{ title: 'statistics', description: 'statistics for the last 120 draws' },
		{ title: 'history of draws', description: 'history of draws' },
	]

	const activeIndex = useMenuStore(state => state.activeIndex)

	const renderSection = () => {
		switch (activeIndex) {
			case 0:
				return <CoefficientsSection />
			case 1:
				return <RulesSection />
			case 2:
				return <StatisticSection />
			case 3:
				return <HistorySection />
			default:
				return null
		}
	}

	return (
		<div className='menu' style={{ display: isOpen ? 'flex' : 'none' }}>
			<nav className='menu__nav'>
				{NAV_SECTIONS.map((selection, index) => (
					<button
						className={`menu__button ${index === activeIndex ? 'active' : ''}`}
						type='button'
						key={index}
						onClick={() => {
							setActiveIndex(index)
							playSound('button')
						}}
					>
						{selection.title}
					</button>
				))}
				<button
					className='menu__button'
					type='button'
					onClick={() => {
						openDialog()
						playSound('button')
					}}
				>
					my bets
				</button>
				<div className='menu__button none-button'></div>
				<button
					className='menu__button'
					type='button'
					onClick={() => {
						close()
						playSound('button')
					}}
				>
					exit menu
				</button>
			</nav>
			<div className='menu__container'>
				<header className='menu__container-header'>
					<div className='menu__title'>
						{NAV_SECTIONS[activeIndex]?.description}
					</div>
					<button
						className='menu__exit'
						type='button'
						onClick={() => {
							close()
							playSound('button')
						}}
					>
						<img src='/img/close.svg' />
					</button>
				</header>
				{renderSection()}
			</div>
			<MyBets />
		</div>
	)
}
