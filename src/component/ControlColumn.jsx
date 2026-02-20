import React, { useEffect, useRef, useState } from 'react'

export default function ControlColumn() {
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

		const totalRotation = extraSpins * 360

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

  useEffect(() => {
		startTimer()
	})

	return (
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
	)
}
