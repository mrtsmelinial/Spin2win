import React from 'react'
import { ControlColumnTop } from './components'
import { ControlColumnCenter } from './components'
import { ControlColumnBottom } from './components'

export default function ControlColumn({ initialCell }) {
	return (
		<div className='roulette__control'>
			<ControlColumnTop />
			<ControlColumnCenter
				initialCell={initialCell}
			/>
			<ControlColumnBottom />
		</div>
	)
}
