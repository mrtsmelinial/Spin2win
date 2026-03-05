import { useCallback, useMemo, useRef } from 'react'
import { useAudio } from '../hooks/useAudio'
import { AudioContext } from './AudioContext'
import useLocalStorage from '../hooks/useLocalStorage'

export function AudioProvider({ children }) {
	const [isMuted, setIsMuted] = useLocalStorage('isMuted', false)

	const sounds = useRef({
		click: useAudio('/audio/click.mp3', 15),
		button: useAudio('/audio/button.mp3', 1),
		win: useAudio('/audio/win.mp3', 1),
		bet: useAudio('/audio/bet.mp3', 3),
	})

	const playSound = useCallback(
		key => {
			if (isMuted) return
			if (sounds.current[key]) sounds.current[key]()
		},
		[isMuted],
	)

	const toggleSound = useCallback(() => setIsMuted(prev => !prev), [setIsMuted])

	const value = useMemo(
		() => ({
			playSound,
			toggleSound,
			isMuted,
		}),
		[playSound, toggleSound, isMuted],
	)

	return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

