import { createContext, useContext} from 'react'
import { useAudio } from '../hooks/useAudio'
import  useLocalStorage  from '../hooks/useLocalStorage'

const AudioContext = createContext(null)

export function AudioProvider({ children }) {
	const [isMuted, setIsMuted] = useLocalStorage('isMuted', false)

	const sounds = {
		click: useAudio('/audio/click.mp3', 15),
		button: useAudio('/audio/button.mp3', 1),
		win: useAudio('/audio/win.mp3', 1),
		bet: useAudio('/audio/bet.mp3', 3),
	}

	const playSound = key => {
		if (isMuted) return
		if (sounds[key]) sounds[key]()
	}

	const toggleSound = () => setIsMuted(prev => !prev)
	return (
		<AudioContext.Provider value={{ playSound, toggleSound, isMuted }}>
			{children}
		</AudioContext.Provider>
	)
}

export const useClickSound = () => useContext(AudioContext)
