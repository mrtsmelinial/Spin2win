import React from 'react'
import ControlColumnTop from './ControlColumnTop'
import ControlColumnCenter from './ControlColumnCenter'
import ControlColumnBottom from './ControlColumnBottom'

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
