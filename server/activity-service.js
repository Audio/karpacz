module.exports = class ActivityService {
	/**
	 * @param {{config: typeof import('./config')}} container
	 */
	constructor({ config }) {
		this.config = config
	}

	// TODO
	// #monthsNames = {
	// 	12: 'Prosinec',
	// 	'01': 'Leden',
	// 	'02': 'Únor',
	// 	'03': 'Březen',
	// 	'04': 'Duben',
	// 	'05': 'Květen',
	// }

	/**
	 * @typedef {{
	 *  user: string
	 *  sport: string
	 *  distance: number
	 * }} Activity
	 * @param {Activity[]} recentActivities
	 * @param {Activity[]} totalActivities
	 */
	sumActivities(recentActivities, totalActivities) {
		const recentSumsByUser = {}
		for (const activity of recentActivities) {
			recentSumsByUser[activity.user] ||= 0
			recentSumsByUser[activity.user] += this.#getFairDistance(
				activity.sport,
				activity.distance,
			)
		}

		const totalSumsByUser = {}
		for (const activity of totalActivities) {
			totalSumsByUser[activity.user] ||= 0
			totalSumsByUser[activity.user] += this.#getFairDistance(
				activity.sport,
				activity.distance,
			)
		}

		return Object.entries(this.config.users).map(([user, name]) => {
			return {
				name,
				recentDistance: recentSumsByUser[user] || 0,
				totalDistance: totalSumsByUser[user] || 0,
			}
		})
	}

	/**
	 * @param {keyof typeof import('./config')['sports']} sport
	 * @param {number} distance
	 */
	#getFairDistance(sport, distance) {
		if (sport === 'bicycle' || sport === 'inline') {
			return distance / 2
		}

		if (sport === 'swimming') {
			return distance * 2
		}

		return distance
	}
}
