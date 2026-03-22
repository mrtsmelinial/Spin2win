const SERVER_KEY_TO_ID = {
	BLACK: 'color-black',
	RED: 'color-red',
	EVEN: 'parity-even',
	ODD: 'parity-odd',
	HALF1: 'range-1-18',
	HALF2: 'range-19-36',
	DOZ1: 'dozen-1',
	DOZ2: 'dozen-2',
	DOZ3: 'dozen-3',
	SECTOR0_A: 'section-a',
	SECTOR0_B: 'section-b',
	SECTOR0_C: 'section-c',
	SECTOR0_D: 'section-d',
	SECTOR0_E: 'section-e',
	SECTOR0_F: 'section-f',
}

export function mapStatistic(statistic) {
	const arrInfo = []
	const arrExtra = []

	for (const key in statistic) {
		const count = parseInt(statistic[key])
		const level = Math.round((count / 15) * 100)
		
		if (/^\d+$/.test(key)) {
			const numKey = parseInt(key)
			if (numKey >= 0 && numKey <= 36) {
				arrInfo.push({ id: numKey, count, level })
				continue
			}
		}

		const id = SERVER_KEY_TO_ID[key]
		if (id) {
			arrExtra.push({ id, count })
		}
	}

	return { arrInfo, arrExtra }
}
