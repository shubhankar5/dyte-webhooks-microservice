"use strict";

const DbMixin = require("../mixins/db.mixin");
const cluster = require('cluster');
const https = require('https');

// Number of requests to process at a time parallely
const maxRequests = 10;

// Function to process a batch of maxRequests times URLs and send POST requests to them
function processUrlBatch(urlBatch) {
  	if(cluster.isMaster) {
    	for(let i = 0; i < maxRequests; i++) {
      		var worker = cluster.fork()
    	}
    	let j = 0;
	    for(var wid in cluster.workers) {
	      	j++;
	      	if (j > maxRequests) 
	      		return;
      		cluster.workers[wid].send({
	        	type: 'request',
	        	counter: j,
	      	});
	    }
	} 
	else {
	    process.on('message', function(message) {
	      	if(message.type === 'request') {
	        	let timeStamp = unixTime = Math.floor(Date.now() / 1000);
	        	let data = JSON.stringify({
	        	  ip: ctx.params.ip,
	        	  timeStamp: timeStamp,
	        	});
				let options = {
				  	hostname: 'localhost',
				  	port: 3000,
				  	path: urlBatch[message.counter],
				  	method: 'POST',
				  	headers: {
				    	'Content-Type': 'application/json',
				    	'Content-Length': data.length
				  	}
				}
				let req = https.request(options, res => {
				  console.log(`statusCode: ${res.statusCode}`)

				  res.on('data', d => {
				    process.stdout.write(d)
				  })
				})

				req.on('error', error => {
				  console.error(error)
				})

				req.write(data)
				req.end()
	      	}
	    })
	}
}

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
			rest: "POST /register/:targetUrl",
			params: {
				targetUrl: "string"
			},
			async handler(ctx) {
				// Insert a new URL in the database
				let obj = await this.adapter.insert({
					url: ctx.params.targetUrl,
				});

				// Return the id of the newly created object
				return obj["_id"];
			}
		},

		update: {
			rest: "PUT /update/:id/:targetUrl",
			params: {
				id: "string|min:1",
				targetUrl: "string|min:1"
			},
			async handler(ctx) {
				let id = ctx.params.id;
				let message = {
					'message': null
				};

				// Check if an entry exists in the database with the obtained id
				let obj = await this.adapter.findOne({
					_id: id
				});

				// If found then update it
				if(obj) {
					obj = await this.adapter.updateById(
						id,
						{
							$set: {	
								url: ctx.params.targetUrl,
							}
						}
					);
					message['message'] = 'Success: Url updated for id=' + id;
				}
				// Else give an error message
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

		remove: {
			rest: "DELETE /remove/:id",
			params: {
				id: "string"
			},
			async handler(ctx) {
				let id = ctx.params.id;
				let message = {
					'message': null
				};

				// Check if an entry exists in the database with the obtained id
				let obj = await this.adapter.removeById(id);

				// If found then delete it
				if(obj) {
					message['message'] = 'Success: Url deleted for id=' + id;
				}
				// Else give an error message
				else {
					message['message'] = 'Failed: ' + 'id=' + id + ' not found';
				}
				
				return message;
			}
		},

		trigger: {
			rest: "GET /trigger/:ip",
			params: {
				ip: "string"
			},
			async handler(ctx) {
				// Get the list of URLs from the database
				let urlList = await this.adapter.find(
					{},
					{
						_id: 0,
						url: 1
					} 
				);

				// Run a loop the number of times the batch of urls has to be processed
				let length = urlList.length ;
			  	for(let i=0; i<length; i+=maxRequests){
					let urlBatch = urlList.slice(i, i + maxRequests)
					processUrlBatch();
				}

				return 1;
			}
		},
	},

	events: {

	},

	methods: {

	},
};
