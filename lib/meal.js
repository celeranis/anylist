const uuid = require('./uuid');

/**
 * @typedef {Object} MealPlanLabel
 * @property {string} identifier
 * @property {string} name
 * @property {string} hexColor
 * @property {number} sortIndex
 * @property {string} calendarId
 * @property {Long} logicalTimestamp
 */

/**
 * Class for planned meals. Currently read-only.
 * @class 
 *
 * @param {object} meal meal
 * @param {object} context context
 *
 * @property {string} identifier
 * @property {string} name
 * @property {string?} details
 * @property {Recipe?} recipe
 * @property {string?} recipeId
 * @property {Date} date
 * @property {string} dateString
 * @property {number?} recipeScaleFactor
 * @property {string?} calendarId
 * @property {Long} logicalTimestamp
 * @property {number?} labelSortIndex
 * @property {number?} orderAddedSortIndex
 */
class Meal {
	/**
   * @hideconstructor
   */
	constructor(i, anylist) {
		/** @type {string} */
		this.identifier = i.identifier || uuid();
		/** @type {Long} */
		this.logicalTimestamp = i.logicalTimestamp;
		/** @type {string} */
		this.calendarId = i.calendarId;
		/** @type {string} */
		this.dateString = i.date;
		/** @type {string} */
		this.name = i.title;
		/** @type {string?} */
		this.details = i.details;
		/** @type {string?} */
		this.recipeId = i.recipeId;
		/** @type {string?} */
		this.labelId = i.labelId;
		/** @type {number?} */
		this.labelSortIndex = i.labelSortIndex;
		/** @type {number?} */
		this.orderAddedSortIndex = i.orderAddedSortIndex;
		/** @type {number?} */
		this.recipeScaleFactor = i.recipeScaleFactor;

		/** @type {Date} */
		this.date = new Date(Date.parse(i.date) + 86400_000)

		/** @type {import('got').Got} */
		this._client = anylist.client;
		this._protobuf = anylist.protobuf;
		/** @type {string} */
		this._uid = anylist.uid;
		/** @type {import('./index')} */
		this._anylist = anylist;
	}

	toJSON() {
		return {
			identifier: this.identifier,
			logicalTimestamp: this.logicalTimestamp,
			calendarId: this.calendarId,
			date: this.dateString,
			title: this.name,
			details: this.details,
			recipeId: this.recipeId,
			labelId: this.labelId,
			orderAddedSortIndex: this.orderAddedSortIndex,
			labelSortIndex: this.labelSortIndex,
			recipeScaleFactor: this.recipeScaleFactor
		};
	}

	_encode() {
		return new this._protobuf.PBCalendarEvent(this.toJSON())
	}

	/** 
	 * @returns {import('./recipe')?}
	 */
	get recipe() {
		return this._anylist.recipes.get(this.recipeId)
	}

	/** 
	 * @returns {MealPlanLabel?}
	 */
	get label() {
		return this._anylist.mealPlanLabels.get(this.labelId)
	}
}

module.exports = Meal;
