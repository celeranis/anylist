const FormData = require('form-data');
const uuid = require('./uuid');

const OP_MAPPING = {
	name: 'set-list-item-name',
	quantity: 'set-list-item-quantity',
	details: 'set-list-item-details',
	checked: 'set-list-item-checked',
	categoryMatchId: 'set-list-item-category-match-id',
	manualSortIndex: 'set-list-item-sort-order'
};

/**
 * Item class.
 * @class
 *
 * @param {object} item item
 * @param {object} context context
 *
 * @property {string} listId
 * @property {string} identifier
 * @property {string} name
 * @property {string} details
 * @property {string} quantity
 * @property {string} checked
 * @property {string} manualSortIndex
 * @property {string} userId
 * @property {string} categoryMatchId
 */
class Item {
	/**
   * @hideconstructor
   */
	constructor(i, anylist) {
		this._listId = i.listId;
		this._identifier = i.identifier || uuid();
		this._name = i.name;
		this._details = i.details;
		this._quantity = i.quantity;
		this._checked = i.checked;
		this._manualSortIndex = i.manualSortIndex;
		this._userId = i.userId;
		this._categoryMatchId = i.categoryMatchId || 'other';

		/** @type {import('./index')} */
		this._client = anylist.client;
		this._protobuf = anylist.protobuf;
		/** @type {string} */
		this._uid = anylist.uid;
		/** @type {import('./index')} */
		this._anylist = anylist;

		/** @type {string[]} */
		this._fieldsToUpdate = [];
	}

	toJSON() {
		return {
			listId: this._listId,
			identifier: this._identifier,
			name: this._name,
			details: this._details,
			quantity: this._quantity,
			checked: this._checked,
			manualSortIndex: this._manualSortIndex,
			userId: this._userId,
			categoryMatchId: this._categoryMatchId
		};
	}

	_encode() {
		return new this._protobuf.ListItem({
			identifier: this._identifier,
			listId: this._listId,
			name: this._name,
			quantity: this._quantity,
			details: this._details,
			checked: this._checked,
			category: this._category,
			userId: this._userId,
			categoryMatchId: this._categoryMatchId,
			manualSortIndex: this._manualSortIndex
		});
	}

	/**
	 * @returns {import('./list')?}
	 */
	get list() {
		return this._anylist.getListById(this._listId)
	}

	/**
	 * @param {import('./list') | string}
	 */
	set list(newList) {
		if (typeof newList == 'string') {
			this.listId = newList
		} else if (newList.identifier) {
			this.listId = newList.identifier
		} else {
			throw new TypeError(`Invalid list type: Must be list object or string id`)
		}
	}

	/** 
	 * @type {string}
	 */
	get identifier() {
		return this._identifier;
	}

	set identifier(_) {
		throw new Error('You cannot update an item ID.');
	}

	/** 
	 * @type {string}
	 */
	get listId() {
		return this._listId;
	}

	set listId(l) {
		if (this._listId === undefined) {
			this._listId = l;
			this._fieldsToUpdate.push('listId');
		} else {
			throw new Error('You cannot move items between lists.');
		}
	}

	/** 
	 * @type {string}
	 */
	get name() {
		return this._name;
	}

	set name(n) {
		this._name = n;
		this._fieldsToUpdate.push('name');
	}

	/** 
	 * @type {number}
	 */
	get quantity() {
		return this._quantity;
	}

	set quantity(q) {
		if (typeof q === 'number') {
			q = q.toString();
		}

		this._quantity = q;
		this._fieldsToUpdate.push('quantity');
	}

	/** 
	 * @type {string}
	 */
	get details() {
		return this._details;
	}

	set details(d) {
		this._details = d;
		this._fieldsToUpdate.push('details');
	}

	/** 
	 * @type {boolean}
	 */
	get checked() {
		return this._checked;
	}

	set checked(c) {
		if (typeof c !== 'boolean') {
			throw new TypeError('Checked must be a boolean.');
		}

		this._checked = c;
		this._fieldsToUpdate.push('checked');
	}

	/** 
	 * @type {string}
	 */
	get userId() {
		return this._userId;
	}

	set userId(_) {
		throw new Error('Cannot set user ID of an item after creation.');
	}

	/** 
	 * @type {string}
	 */
	get categoryMatchId() {
		return this.categoryMatchId;
	}

	set categoryMatchId(i) {
		this._categoryMatchId = i;
		this._fieldsToUpdate.push('categoryMatchId');
	}

	/** 
	 * @type {number}
	 */
	get manualSortIndex() {
		return this._manualSortIndex;
	}

	set manualSortIndex(i) {
		if (typeof i !== 'number') {
			throw new TypeError('Sort index must be a number.');
		}

		this._manualSortIndex = i;
		this._fieldsToUpdate.push('manualSortIndex');
	}

	/**
   * Save local changes to item to
   * AnyList's API.
   * @return {Promise}
   */
	async save() {
		const ops = this._fieldsToUpdate.map(field => {
			const value = this[field];
			const opName = OP_MAPPING[field];

			const op = new this._protobuf.PBListOperation();

			op.setMetadata({
				operationId: uuid(),
				handlerId: opName,
				userId: this._uid
			});

			op.setListId(this._listId);
			op.setListItemId(this._identifier);

			if (typeof value === 'boolean') {
				op.setUpdatedValue(value === true ? 'y' : 'n');
			} else {
				op.setUpdatedValue(value.toString());
			}

			return op;
		});

		const opList = new this._protobuf.PBListOperationList();

		opList.setOperations(ops);

		const form = new FormData();

		form.append('operations', opList.toBuffer());

		await this._client.post('data/shopping-lists/update', {
			body: form
		});
	}
}

module.exports = Item;
