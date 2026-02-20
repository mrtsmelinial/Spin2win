import React from 'react'

export default function SpinnerTimer({progressRef}) {
	return (
		<svg
			version='1.1'
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 712.7 712.7'
			class='roulette__time'
		>
			<path
				className='load0-st1'
				d='M296.4,19.6C136.5,47.8,15,187.4,15,355.4c0,188.3,152.7,341,341,341s341-152.7,341-341
              c0-168-121.5-307.6-281.4-335.8'
			></path>
			<path
				className='load1-st0'
				ref={progressRef}
				d='M296.4,19.6C136.5,47.8,15,187.4,15,355.4c0,188.3,152.7,341,341,341s341-152.7,341-341
              c0-168-121.5-307.6-281.4-335.8'
			></path>
		</svg>
	)
}
