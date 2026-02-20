import React, { useEffect, useRef, useState } from 'react'

const addBetsArray = [
	{
		title: 'A',
		size: 2,
	},
	{
		title: 'B',
		size: 2,
	},
	{
		title: 'C',
		size: 2,
	},
	{
		title: 'D',
		size: 2,
	},
	{
		title: 'E',
		size: 2,
	},
	{
		title: 'F',
		size: 2,
	},
	{
		title: 'RED',
		size: 3,
	},
	{
		title: 'BLACK',
		size: 3,
	},
	{
		title: 'EVEN',
		size: 3,
	},
	{
		title: 'ODD',
		size: 3,
	},
	{
		title: '1-18',
		size: 3,
	},
	{
		title: '19-36',
		size: 3,
	},
	{
		title: '1-12',
		size: 2,
	},
	{
		title: '13-24',
		size: 2,
	},
	{
		title: '25-36',
		size: 2,
	},
]

const sumBet = ['0,50', '1,00', '2,00', '5,00']

function createArrayInfo() {
	const arr = []

	for (let i = 0; i < 37; i++) {
		arr.push({
			id: i,
			level: i,
		})
	}

	return arr
}

const redNumbers = new Set([
	1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
])

const rouletteData = Array.from({ length: 37 }, (_, i) => {
	let color

	if (i === 0) {
		color = 'g'
	} else if (redNumbers.has(i)) {
		color = 'r'
	} else {
		color = 'b'
	}

	return {
		number: i,
		color,
	}
})

const sortedData = [...rouletteData.filter(item => item.number !== 0)]

export default function App() {
	const [onAddBets, setOnAddBets] = useState(false)
	const [currentBetIndex, setCurrentBetIndex] = useState(0)
	const arrInfo = createArrayInfo()

	const handleClick = () => {
		setCurrentBetIndex(prev => (prev + 1) % sumBet.length)
	}

	const [isFullScreen, setIsFullScreen] = useState(false)

	const toggleFullScreen = () => {
		if (!isFullScreen) {
			const elem = document.documentElement

			if (elem.requestFullscreen) {
				elem.requestFullscreen()
			} else if (elem.mozRequestFullScreen) {
				elem.mozRequestFullScreen()
			} else if (elem.webkitRequestFullscreen) {
				elem.webkitRequestFullscreen()
			} else if (elem.msRequestFullscreen) {
				elem.msRequestFullscreen()
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen()
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen()
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen()
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen()
			}
		}
	}

	useEffect(() => {
		const handleFullScreenChange = () => {
			setIsFullScreen(
				document.fullscreenElement ||
					document.webkitFullscreenElement ||
					document.mozFullScreenElement ||
					document.msFullscreenElement,
			)
		}

		document.addEventListener('fullscreenchange', handleFullScreenChange)
		document.addEventListener('webkitfullscreenchange', handleFullScreenChange)
		document.addEventListener('mozfullscreenchange', handleFullScreenChange)
		document.addEventListener('MSFullscreenChange', handleFullScreenChange)

		return () => {
			document.removeEventListener('fullscreenchange', handleFullScreenChange)
			document.removeEventListener(
				'webkitfullscreenchange',
				handleFullScreenChange,
			)
			document.removeEventListener(
				'mozfullscreenchange',
				handleFullScreenChange,
			)
			document.removeEventListener('MSFullscreenChange', handleFullScreenChange)
		}
	}, [])

	const progressRef = useRef(null)
	const wheelRef = useRef(null)

	useEffect(() => {
		startTimer()
	}, [])

	const startTimer = () => {
		const path = progressRef.current
		const duration = 15000
		const length = path.getTotalLength()

		path.style.transition = 'none'
		path.style.strokeDasharray = length
		path.style.strokeDashoffset = 0

		let startTime = null

		const animate = time => {
			if (!startTime) startTime = time
			const progress = time - startTime
			const percent = Math.min(progress / duration, 1)

			path.style.strokeDashoffset = length * percent

			if (percent < 1) {
				requestAnimationFrame(animate)
			} else {
				startSpin()
			}
		}

		requestAnimationFrame(animate)
	}

	const startSpin = () => {
		const wheel = wheelRef.current

		const spinDuration = 30000 // 30 сек
		const extraSpins = 20
		const finalDegree = Math.floor(Math.random() * 360)

		const totalRotation = extraSpins * 360 + finalDegree

		wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
		wheel.style.transform = `rotate(${totalRotation}deg)`

		wheel.addEventListener('transitionend', handleSpinEnd, {
			once: true,
		})
	}

	const handleSpinEnd = () => {
		const wheel = wheelRef.current

		// получаем текущий угол
		const computedStyle = window.getComputedStyle(wheel)
		const matrix = new DOMMatrix(computedStyle.transform)
		const currentRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)

		// сбрасываем без анимации
		wheel.style.transition = 'none'
		wheel.style.transform = `rotate(${currentRotation}deg)`

		// перезапускаем таймер
		setTimeout(() => {
			startTimer()
		}, 100)
	}
	return (
		<main className='roulette'>
			<div className='roulette__game-container'>
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
						<div className='roulette__stat-item '>
							{arrInfo.map(item => (
								<div
									className='roulette__stat-cell roulette__stat-cell--level'
									key={`level-${item.id}`}
									style={{ '--level-cell': `${item.level}%` }}
								></div>
							))}
						</div>
						<div className='roulette__stat-item'>
							{arrInfo.map(item => (
								<div
									className='roulette__stat-cell roulette__stat-cell--number'
									key={item.id}
								></div>
							))}
						</div>
					</div>
				</div>
				<div className='roulette__history'>
					{rouletteData.slice(10, 20).map((item, index) => (
						<div
							className='roulette__history-item'
							key={index}
							style={{
								backgroundColor: `var(--cell-color-${item.color})`,
							}}
						>
							<span className='roulette__history-number'>{item.number}</span>
						</div>
					))}
				</div>
				<div className='roulette__wrapper'>
					<div className='roulette__control'>
						<div className='roulette__control-top'>
							<button
								className='roulette__button roulette__button--fullscreen'
								type='button'
								onClick={toggleFullScreen}
							></button>
							<div className='roulette__balance'>
								<img className='roulette__icon-coin' src='../img/coins.svg' />
								<span>$10000,00</span>
							</div>
							<button
								className='roulette__button roulette__button--mute'
								type='button'
							></button>
						</div>
						<div className='roulette__control-center'>
							<div className='roulette__spinner-bg'>
								<div className='roulette__pointer'></div>
								<div className='roulette__spinner-wheel' ref={wheelRef}>
									<div className='roulette__spinner-num'></div>
								</div>
								<svg
									version='1.1'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 712.7 712.7'
									class='roulette__time'
								>
									<path
										className='load0-st1'
										d='M296.4,19.6C136.5,47.8,15,187.4,15,355.4c0,188.3,152.7,341,341,341s341-152.7,341-341
              c0-168-121.5-307.6-281.4-335.8'
									></path>
									<path
										className='load1-st0'
										ref={progressRef}
										d='M296.4,19.6C136.5,47.8,15,187.4,15,355.4c0,188.3,152.7,341,341,341s341-152.7,341-341
              c0-168-121.5-307.6-281.4-335.8'
									></path>
								</svg>
							</div>
						</div>
						<div className='roulette__control-bottom'>
							<button className='roulette__button roulette__button--menu'></button>
							<div className='roulette__session'># 650 825</div>
							<div className='roulette__jackpot'>
								<div className='roulette__jackpot-list'>
									<div className='roulette__jackpot-img roulette__jackpot-img--big'></div>
									<div className='roulette__jackpot-img roulette__jackpot-img--super'></div>
									<div className='roulette__jackpot-img roulette__jackpot-img--mega'></div>
									<div className='roulette__jackpot-img roulette__jackpot-img--big'></div>
								</div>
							</div>
							<div className='roulette__winning'>$2000,00</div>
						</div>
					</div>
					<div className='roulette__bet'>
						<div className='roulette__cell'>
							{onAddBets
								? addBetsArray.map((item, index) => (
										<button
											className={`roulette__cell-item-add roulette__cell-item-add--size-${item.size}`}
											key={index}
											type='button'
										>
											{item.title}
										</button>
									))
								: sortedData.map((item, index) => (
										<button
											className='roulette__cell-item active'
											key={index}
											style={{
												backgroundColor: `var(--cell-color-${item.color})`,
											}}
											type='button'
										>
											{item.number}
											<div className='roulette__cell-bet'>2.00</div>
										</button>
									))}

							<div className='roulette__cell-footer'>
								<button
									className='roulette__cell-item roulette__cell-item--zero'
									type='button'
								>
									0
								</button>
								<button
									className='roulette__cell-item roulette__cell-item--more-bets'
									type='button'
									onClick={() => setOnAddBets(prev => !prev)}
								>
									{onAddBets ? 'MAIN BETS' : 'ADD.BETS'}
								</button>
							</div>
						</div>
						<div className='roulette__bet-controls'>
							<button className='roulette__bet-button' type='button'>
								<svg
									className='roulette__bet-icon'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='58 15 60 60'
									fill='#ffffff'
								>
									<path
										d='M108.1,41.2c-5.6-10.4-18.3-14.1-28.5-8.4c-4.3,2.4-7.6,6.3-9.4,11L67.4,43c-0.7-0.2-1.4,0.1-1.9,0.6
      c-0.5,0.6-0.6,1.3-0.3,2l3.9,7.3c0.2,0.6,0.7,1,1.4,1.2c0.6,0.1,1.3,0,1.7-0.5l5.8-5.1c0.5-0.5,0.7-1.2,0.5-1.9
      c0-0.2-0.1-0.3-0.2-0.4c-0.3-0.5-0.7-0.8-1.3-1l-3.1-0.6c1.5-3.5,4.1-6.5,7.4-8.4c8.3-4.7,18.7-1.6,23.3,6.9
      c1.4,2.7,2.1,5.6,2.1,8.4c0,0.9,0.6,1.7,1.4,1.9c1.2,0.3,2.4-0.6,2.4-1.9C110.7,48,109.9,44.5,108.1,41.2z'
									></path>
								</svg>
								<span>UNDO</span>
							</button>
							<button className='roulette__bet-button' type='button'>
								<svg
									className='roulette__bet-icon'
									viewBox='80 160 20 70'
									xmlns='http://www.w3.org/2000/svg'
									fill='#ffffff'
								>
									<g>
										<path
											class='st3_b'
											d='M74.9,187.4c-0.3,0-0.6-0.1-0.8-0.1c-0.8-0.2-1.3-0.7-1.3-1.6c0-1,0-2,0-3.1c0.1-2.3,1.8-4.1,3.8-4.1
            c1.5,0,3.1,0,4.6,0c0.2,0,0.5,0,0.8,0c0-1,0-1.9,0-2.8c0-1.4,0.6-2,1.8-2c3.3,0,6.6,0,9.9,0c1.3,0,1.8,0.6,1.8,2
            c0,0.9,0,1.8,0,2.8c1.7,0,3.3,0,4.9,0c2.7,0,4.3,1.8,4.3,4.8c0,0.7,0,1.3,0,2c0,1.5-0.4,2-1.7,2.1c-0.1,0-0.2,0-0.4,0.1
            c0,0.3,0,0.7,0,1c0,7.8,0,15.6,0,23.3c0,3.5-1.9,6-4.9,6.6c-0.4,0.1-0.8,0.1-1.2,0.1c-5.2,0-10.4,0-15.7,0c-3.7,0-6-2.7-6-6.8
            c0-7.7,0-15.4,0-23.2C74.9,188.1,74.9,187.8,74.9,187.4z M77.9,187.4c0,0.4,0,0.6,0,0.8c0,7.8,0,15.6,0,23.4
            c0,2.2,1.1,3.4,3.1,3.4c5.2,0,10.4,0,15.6,0c2.1,0,3.1-1.2,3.1-3.6c0-7.7,0-15.4,0-23.2c0-0.3,0-0.6,0-0.9
            C92.4,187.4,85.2,187.4,77.9,187.4z M101.8,184c0.2-1.9-0.1-2.2-1.7-2.2c-7.6,0-15.1,0-22.7,0c-1.6,0-1.8,0.9-1.5,2.2
            C84.5,184,93.1,184,101.8,184z M92.6,178.5c0-0.5,0-1,0-1.4c-2.5,0-5,0-7.5,0c0,0.5,0,0.9,0,1.4C87.6,178.5,90,178.5,92.6,178.5z'
										></path>
										<path
											class='st3_b'
											d='M86.3,201.4c0,3,0,6,0,8.9c0,1.3-0.9,2.1-1.9,1.7c-0.7-0.2-1.1-0.9-1.1-1.9c0-3.5,0-6.9,0-10.4
            c0-2.5,0-5.1,0-7.6c0-0.8,0.3-1.4,1-1.7c0.6-0.2,1.2-0.1,1.5,0.4c0.2,0.4,0.4,1,0.4,1.4C86.3,195.3,86.3,198.3,86.3,201.4z'
										></path>
										<path
											class='st3_b'
											d='M91.3,201.2c0-2.9,0-5.9,0-8.8c0-1.3,0.5-2,1.5-2c0.9,0,1.5,0.7,1.5,2c0,5.9,0,11.9,0,17.8c0,1.2-0.6,2-1.5,2
            s-1.5-0.7-1.5-1.9C91.3,207.2,91.3,204.2,91.3,201.2z'
										></path>
									</g>
								</svg>
								<span>CLEAR</span>
							</button>
							<button className='roulette__bet-button' type='button'>
								<span className='roulette__bet-text roulette__bet-text--big'>
									x2
								</span>
							</button>
							<button
								className='roulette__bet-button'
								type='button'
								onClick={handleClick}
							>
								<span className='roulette__bet-text'>
									{sumBet[currentBetIndex]}
								</span>
								<span>BET</span>
							</button>
							<button className='roulette__bet-button' type='button'>
								<svg
									className='roulette__bet-icon'
									viewBox='55 650 70 20'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M77.8,642.9l-2.2-2.1c-0.5-0.5-1.3-0.6-1.9-0.4c-0.7,0.3-1.1,0.9-1.2,1.6l0,8.3c-0.1,0.6,0.2,1.3,0.6,1.7
          c0.5,0.4,1.1,0.6,1.7,0.4l7.5-1.5c0.7-0.2,1.2-0.7,1.4-1.4c0-0.2,0.1-0.3,0.1-0.5c0-0.6-0.2-1.1-0.6-1.5l-2.4-2.1
          c3-2.3,6.6-3.7,10.4-3.7c9.4,0,17.1,7.9,17.1,17.6c0,9.7-7.7,17.6-17.1,17.6c-6.2,0-12-3.5-15-9.1c-0.5-0.9-1.7-1.3-2.6-0.8
          c-0.9,0.5-1.3,1.7-0.7,2.7c3.7,6.8,10.7,11.1,18.3,11.1c11.5,0,20.9-9.6,20.9-21.5c0-11.8-9.4-21.5-20.9-21.5
          C86.2,637.9,81.5,639.7,77.8,642.9z'
										fill='#FFFFFF'
									></path>
								</svg>
								<span>REBET</span>
							</button>
						</div>
						<div className='roulette__total-bet'>
							<span className='roulette__total-text'>TOTAL AMOUNT OF BET:</span>
							<span className='roulette__total-sum'>0,00</span>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
