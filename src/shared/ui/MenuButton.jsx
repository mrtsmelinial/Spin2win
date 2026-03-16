import React from 'react'
import { useClickSound } from '@/shared/model'
import { open } from '../../domain/menu/model/store'

export function MenuButton() {
	const { playSound } = useClickSound()
	return (
		<button
			className='game__button game__button--menu'
			onClick={() => {
				playSound('button')
				open()
			}}
		></button>
	)
}
