import React from 'react'
import ControlColumnTop from './ControlColumnTop'
import ControlColumnCenter from './ControlColumnCenter'
import ControlColumnBottom from './ControlColumnBottom'

export default function ControlColumn({ onSpinComplete, initialCell }) {
	return (
		<div className='roulette__control'>
			<ControlColumnTop />
			<ControlColumnCenter onSpinComplete={onSpinComplete} initialCell={initialCell} />
			<ControlColumnBottom />
		</div>
	)
}
