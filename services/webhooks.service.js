"use strict";

const DbMixin = require("../mixins/db.mixin");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "webhooks",

	mixins: [DbMixin("webhooks")],

	settings: {
		// Available fields in the responses
		fields: [
			"_id",
			"url",
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			url: "string|min:1",
		}
	},

	actions: {

		register: {
			rest: "GET /register/:targetUrl",
			params: {
				targetUrl: "string"
			},
			async handler(ctx) {
				const uuidv4 = require("uuid/v4");
				const uniqueId = uuidv4();

				let obj = await this.adapter.insert({
					url: ctx.params.targetUrl,
				});

				return obj["_id"];
			}
		},

		update: {
			rest: "GET /update/:id/:targetUrl",
			params: {
				id: "string|min:1",
				targetUrl: "string|min:1"
			},
			async handler(ctx) {
				let id = ctx.params.id;
				let obj = await this.adapter.findOne({id});
				let message = {
					'message': null
				};
				if(obj) {
					obj = await this.adapter.updateById({
						id,
						url: ctx.params.targetUrl,
					});
					message['message'] = 'Success: Url updated for id=' + id;
				}
				else {
					message['message'] = 'Failed: ' + 'id=' + id + ' not found';
				}
				
				return message;
			}
		},

		list: {
			rest: "GET /list",
			async handler(ctx) {
				let allObjects = await this.adapter.find();

				return allObjects;
			}
		},
	},

	events: {

	},

	methods: {

	},
};
