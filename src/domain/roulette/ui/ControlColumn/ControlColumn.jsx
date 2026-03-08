import React from 'react'
import { ControlColumnTop } from './components'
import { ControlColumnCenter } from './components'
import { ControlColumnBottom } from './components'

export default function ControlColumn() {
	return (
		<div className='roulette__control'>
			<ControlColumnTop />
			<ControlColumnCenter/>
			<ControlColumnBottom />
		</div>
	)
}
