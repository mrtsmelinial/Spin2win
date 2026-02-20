import React, { useState } from 'react'

const addBetsArray = [
  {
    title: 'A',
    size: 2,
  },
  {
    title: 'B',
    size: 2,
  },
  {
    title: 'C',
    size: 2,
  },
  {
    title: 'D',
    size: 2,
  },
  {
    title: 'E',
    size: 2,
  },
  {
    title: 'F',
    size: 2,
  },
  {
    title: 'RED',
    size: 3,
  },
  {
    title: 'BLACK',
    size: 3,
  },
  {
    title: 'EVEN',
    size: 3,
  },
  {
    title: 'ODD',
    size: 3,
  },
  {
    title: '1-18',
    size: 3,
  },
  {
    title: '19-36',
    size: 3,
  },
  {
    title: '1-12',
    size: 2,
  },
  {
    title: '13-24',
    size: 2,
  },
  {
    title: '25-36',
    size: 2,
  },
]

const redNumbers = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
])

const rouletteData = Array.from({ length: 37 }, (_, i) => {
  let color

  if (i === 0) {
    color = 'g'
  } else if (redNumbers.has(i)) {
    color = 'r'
  } else {
    color = 'b'
  }

  return {
    number: i,
    color,
  }
})

const sortedData = [...rouletteData.filter(item => item.number !== 0)]

export default function BetColumnBettingGrid() {
  const [onAddBets, setOnAddBets] = useState(false) //изменить название на переключение
	return (
		<div className='roulette__cell'>
			{onAddBets
				? addBetsArray.map((item, index) => (
						<button
							className={`roulette__cell-item-add roulette__cell-item-add--size-${item.size}`}
							key={index}
							type='button'
						>
							{item.title}
						</button>
					))
				: sortedData.map((item, index) => (
						<button
							className='roulette__cell-item active'
							key={index}
							style={{
								backgroundColor: `var(--cell-color-${item.color})`,
							}}
							type='button'
						>
							{item.number}
							<div className='roulette__cell-bet'>2.00</div>
						</button>
					))}

			<div className='roulette__cell-footer'>
				<button
					className='roulette__cell-item roulette__cell-item--zero'
					type='button'
				>
					0
				</button>
				<button
					className='roulette__cell-item roulette__cell-item--more-bets'
					type='button'
					onClick={() => setOnAddBets(prev => !prev)}
				>
					{onAddBets ? 'MAIN BETS' : 'ADD.BETS'}
				</button>
			</div>
		</div>
	)
}
