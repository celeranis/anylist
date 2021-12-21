const uuid = require('./uuid');

/**
 * @typedef {Object} RecipeIngredient
 * @property {string} identifier
 * @property {string} rawIngredient
 * @property {string} name
 * @property {string} quantity
 * @property {string} [note]
 * @property {boolean} isHeading
 */

/**
 * Class for recipes. Currently read-only.
 * @class 
 *
 * @param {object} recipe recipe
 * @param {object} context context
 *
 * @property {string} identifier
 * @property {number} timestampValue
 * @property {Date} timestamp
 * @property {string} name
 * @property {string?} icon
 * @property {string?} note
 * @property {string?} sourceName
 * @property {string?} sourceUrl
 * @property {RecipeIngredient[]} ingredients
 * @property {string[]} preparationSteps
 * @property {string[]} photoIds
 * @property {string?} adCampaignId
 * @property {string[]} photoUrls
 * @property {number?} scaleFactor
 * @property {number?} rating
 * @property {number} creationTimestampValue
 * @property {Date} creationTimestamp
 * @property {string?} nutritionalInfo
 * @property {number?} cookTime
 * @property {number?} prepTime
 * @property {string?} servings
 * @property {string?} paprikaIdentifier
 * @property {string?} recipeDataId
 */
class Recipe {
	/**
   * @hideconstructor
   */
	constructor(i, {client, protobuf, uid}) {
		/** @type {string} */
		this.identifier = i.identifier || uuid();
		/** @type {number} */
		this.timestampValue = i.timestamp;
		/** @type {Date} */
		this.timestamp = new Date(i.timestamp * 1000);
		/** @type {string} */
		this.name = i.name;
		/** @type {string?} */
		this.icon = i.icon;
		/** @type {string?} */
		this.note = i.note;
		/** @type {string?} */
		this.sourceName = i.sourceName;
		/** @type {string?} */
		this.sourceUrl = i.sourceUrl;
		/** @type {RecipeIngredient[]} */
		this.ingredients = i.ingredients;
		/** @type {string[]} */
		this.preparationSteps = i.preparationSteps;
		/** @type {string[]} */
		this.photoIds = i.photoIds;
		/** @type {string?} */
		this.adCampaignId = i.adCampaignId;
		/** @type {string[]} */
		this.photoUrls = i.photoUrls;
		/** @type {number?} */
		this.scaleFactor = i.scaleFactor;
		/** @type {number?} */
		this.rating = i.rating;
		/** @type {number} */
		this.creationTimestampValue = i.creationTimestamp;
		/** @type {Date} */
		this.creationTimestamp = new Date(i.creationTimestamp * 1000);
		/** @type {string?} */
		this.nutritionalInfo = i.nutritionalInfo;
		/** @type {number?} */
		this.cookTime = i.cookTime;
		/** @type {number?} */
		this.prepTime = i.prepTime;
		/** @type {string?} */
		this.servings = i.servings;
		/** @type {string?} */
		this.paprikaIdentifier = i.paprikaIdentifier;
		/** @type {string?} */
		this.recipeDataId = i.recipeDataId;

		/** @type {import('./index')} */
		this._client = client;
		this._protobuf = protobuf;
		/** @type {string} */
		this._uid = uid;
	}

	toJSON() {
		return {
			identifier: this.identifier,
			timestamp: this.timestampValue,
			name: this.name,
			icon: this.icon,
			note: this.note,
			sourceName: this.sourceName,
			sourceUrl: this.sourceUrl,
			ingredients: this.ingredients,
			preparationSteps: this.preparationSteps,
			photoIds: this.photoIds,
			adCampaignId: this.adCampaignId,
			photoUrls: this.photoUrls,
			scaleFactor: this.scaleFactor,
			rating: this.rating,
			creationTimestamp: this.creationTimestampValue,
			nutritionalInfo: this.nutritionalInfo,
			cookTime: this.cookTime,
			prepTime: this.prepTime,
			servings: this.servings,
			paprikaIdentifier: this.paprikaIdentifier,
			recipeDataId: this.recipeDataId
		};
	}

	_encode() {
		return new this._protobuf.PBCalendarEvent(this.toJSON())
	}
}

module.exports = Recipe;
