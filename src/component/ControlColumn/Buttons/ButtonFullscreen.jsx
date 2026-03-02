import React, { useEffect, useState } from 'react'
import { useClickSound } from '../../../context/AudioProvider'

export default function ButtonFullscreen() {

  const [isFullScreen, setIsFullScreen] = useState(false)
	const {playSound} = useClickSound()

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
		playSound('button')
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

  return (
		<button
			className='roulette__button roulette__button--fullscreen'
			type='button'
			onClick={toggleFullScreen}
		></button>
	)
}
