import React from 'react'
import { ControlColumnTop } from './components'
import { ControlColumnCenter } from './components'
import { ControlColumnBottom } from './components'

export default function ControlColumn({ onSpinComplete, initialCell, setBetting }) {
	return (
		<div className='roulette__control'>
			<ControlColumnTop />
			<ControlColumnCenter
				onSpinComplete={onSpinComplete}
				initialCell={initialCell}
				setBetting={setBetting}
			/>
			<ControlColumnBottom />
		</div>
	)
}
