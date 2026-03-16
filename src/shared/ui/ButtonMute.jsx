import React from 'react'
import { useClickSound } from '@/shared/model'

export default function ButtonMute() {
	const { isMuted, toggleSound } = useClickSound()
	return (
		<button
			className={`game__button ${isMuted ? 'game__button--muted' : 'game__button--audio'}`}
			type='button'
			onClick={() => toggleSound()}
		></button>
	)
}
