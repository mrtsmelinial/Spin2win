import React from 'react'
import { useClickSound } from '@/domain/hooks'

export default function ButtonMute() {
	const { isMuted, toggleSound } = useClickSound()
	return (
		<button
			className={`roulette__button ${isMuted ? 'roulette__button--muted' : 'roulette__button--audio'}`}
			type='button'
			onClick={() => toggleSound()}
		></button>
	)
}
