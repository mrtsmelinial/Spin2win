import React from 'react'
import { useRoundStore } from '../model/store/store'

export default function Round() {
	const round = useRoundStore(state => state.round)

	return (
		<div className='roulette__session'># {(round).toLocaleString('ru-RU')}</div>
	)
}
