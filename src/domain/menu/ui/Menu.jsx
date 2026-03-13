import React from 'react'
import { close, setActiveIndex, useMenuStore } from '../model/store'
import { useClickSound } from '@/shared/model'
import { HistorySection } from '@/domain/history'
import StatisticSection from '@/domain/statistic/ui/StatisticMenu'

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
		<div className='roulette__menu-coefficients'>
			<ul className='roulette__menu-list'>
				{COEFFICIENT_TABLE.map((item, index) => (
					<li className='roulette__menu-item' key={index}>
						<div className='roulette__item-title'>{item.title}</div>
						<div className='roulette__item-coef'>x{item.coef}</div>
					</li>
				))}
			</ul>
		</div>
	)
}

function RulesSection() {
	return (
		<div className='roulette__menu-rules'>
			<div className='roulette__rules-text'>
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
		<div
			className='roulette__menu'
			style={{ display: isOpen ? 'flex' : 'none' }}
		>
			<nav className='roulette__menu-nav'>
				{NAV_SECTIONS.map((selection, index) => (
					<button
						className={`roulette__menu-button ${index === activeIndex ? 'active' : ''}`}
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
					className='roulette__menu-button'
					type='button'
					onClick={() => playSound('button')}
				>
					my bets
				</button>
				<div className='roulette__menu-button none-button'></div>
				<button
					className='roulette__menu-button'
					type='button'
					onClick={() => {
						close()
						playSound('button')
					}}
				>
					exit menu
				</button>
			</nav>
			<div className='roulette__menu-info'>
				<header className='roulette__menu-header'>
					<div className='roulette__menu-title'>
						{NAV_SECTIONS[activeIndex]?.description}
					</div>
					<button
						className='roulette__menu-exit'
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
		</div>
	)
}
