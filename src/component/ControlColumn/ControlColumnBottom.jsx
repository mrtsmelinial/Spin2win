import React from 'react'
import Jackpots from './Jackpots'
import JacpotsAmount from './JacpotsAmount'

export default function ControlColumnBottom() {
  return (
		<div className='roulette__control-bottom'>
			<button className='roulette__button roulette__button--menu'></button>
			<div className='roulette__session'># 650 825</div>
			<Jackpots/>
			<JacpotsAmount/>
		</div>
	)
}
