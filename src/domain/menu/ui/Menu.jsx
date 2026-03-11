import React from 'react'
import { useClickSound } from '@/shared/model'

export default function Menu() {
	const { playSound } = useClickSound()
	return (
		<button
			className='roulette__button roulette__button--menu'
			onClick={() => playSound('button')}
		></button>
	)
}
