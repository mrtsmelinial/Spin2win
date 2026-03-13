import React from 'react'
import { useClickSound } from '@/shared/model'
import { open } from '../model/store'

export function MenuButton() {
	const { playSound } = useClickSound()
	return (
		<button
			className='roulette__button roulette__button--menu'
			onClick={() => {
				playSound('button')
				open()
			}}
		></button>
	)
}
