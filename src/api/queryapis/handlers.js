const csvtojson =require("csvtojson");
const db = require('./db').db;
const Crud = require('./models/Crud');


export let save = async (request) => {
	try {
		let file = request.payload.file;

		let array = [];

	 	csvtojson({
		    checkType:true
		}).fromString(file).on("data", data => {
			const jsonStr= data.toString('utf8');

			array.push(JSON.parse(jsonStr)); //Here pushing data to array.

			/* Since we have to upload million of records to db, Check the length of the array.
			When the array is exceeds to defined length (i.e, 100), call the insert function on the array,
			and then reset the array to empty. This will then save the records in chunks of 100.
			If their is any error in this process, done callback will be called.
			We can also use any queying system like RabitMQ for this purpose which is a more reliable 
			approach in the production. */
			if (array.length > 100 ) {  
				insert(array);
				array = [];
			}
		}).on('done',(error)=>{
		    if (error) {
		    	console.log(error);
		    }
		    else {
		    	insert(array); //save the final records.
		    }
		})

		return 200;
	}
	catch (err) {
		console.error(err);
	}
}

let insert  = async (jsArray) => {
	try {
		await Crud.collection.insertMany(jsArray);
	}
	catch (err) {
		console.log(err);
	}
}

export let fetch = async (request) => {
	try {
		let queryObj = request.query;

		//Declare options 
		let options = {
			operators : ['>=', '<=', '>', '<', '='],
			substitutes : ['$gte', '$lte', '$gt', '$lt', '$eq'],
			booleanFields : ['has_depositted']
		}

		let qs = parseQuery(queryObj, options);

		let result = await Crud.find(JSON.parse(qs));

		return result;
	}
	catch (err) {
		console.error(err);
	}
}

export let updateById = async (request) => {
	try {
		let id = request.query.id;
		let obj = request.query;

		delete obj.id;

		let result = await Crud.collection.updateOne({ user_id: id }, { $set: obj });

		return result;
	}
	catch (err) {
		console.error(err);
	}
}

export let deleteById = async (request) => {
	try {
		let id = request.query.id;

		let result = await Crud.collection.deleteOne({ user_id: id });

		return result;
	}
	catch (err) {
		console.error(err);
	}
}

let parseQuery = (queryObj, options) => {
	let operators = options.operators; //Array of all the operators used by api.
	let substitutes = options.substitutes; //Array of corresponding substitutes of operators.
	let booleanFields = options.booleanFields; //Declare boolean fields.

	try {
		if (queryObj) {
			let str = queryObj.q.replace(/\s+/g, ""); //Remove white space from str.

			let strArray = [];
			let query;

			for (let i=0; i<booleanFields.length; i++) { // Check for boolean fields.
				let patt = new RegExp('\NOT\\s*'+ booleanFields[i] + '|' + booleanFields[i], 'g');

				str = str.replace(patt, function (match) {
					if (match === `NOT${booleanFields[i]}` || match === `NOT ${booleanFields[i]}`) {
						return `${booleanFields[i]}: false`;
					}
					if (match === booleanFields[i]) {
						return `${booleanFields[i]}: true`;
					}
				});
			}
			
			if (/\(([^\)]+)\)/g.test(str)) { //Check for parenthesis.

				let array = [];

				let string = str.replace(/\(([^\)]+)\)/g, function (match) {
					let replacer;

					match = match.slice(1, -1);

					if (/AND/g.test(match)) { 
						let split = match.split("AND");
						let arr = [];

						for (let i=0; i<split.length; i++) {
							arr.push(`{${split[i]}}`);
						}

						replacer = `{$and:[${arr}]}`;
					}

					if (/OR/g.test(match)) { 
						let split = match.split("OR");
						let arr = [];

						for (let i=0; i<split.length; i++) {
							arr.push(`{${split[i]}}`);
						}

						replacer = `{$or:[${arr}]}`;
					}

					return replacer;
				});

				if (/OR/g.test(string)) {  
					let split = string.split("OR");
					let arr = [];

					for (let i=0; i<split.length; i++) {
						arr.push(split[i]);
					}

					strArray.push(`{$or:[${arr}]}`);
				}

				if (/AND/g.test(string)) { 
					let split = string.split("AND");
					let arr = [];

					for (let i=0; i<split.length; i++) {
						arr.push(split[i]);
					}

					strArray.push(`{$and:[${arr}]}`);
				}

				if (!strArray[0]) {
					strArray[0] = string;
				}
			}
			else {
				if (/OR/g.test(str)) { 
					let split = str.split("OR");
					let arr = [];

					for (let i=0; i<split.length; i++) {
						arr.push(`{${split[i]}}`);
					}

					strArray.push(`{$or:[${arr}]}`);
				}

				if (/AND/g.test(str)) { 
					let split = str.split("AND");
					let arr = [];

					for (let i=0; i<split.length; i++) {
						arr.push(`{${split[i]}}`);
					}

					strArray.push(`{$and:[${arr}]}`);
				}
			}

			if (!(/AND|OR/g).test(str)) {
				strArray.push(`{${str}}`);
			}

			query = strArray[0];
			

			for (let i=0; i<operators.length; i++) { //Replace operators with their corresponding substitutes.
				let patt = new RegExp('\\' + operators[i] + '\\s*\\d+', 'g');

				query = query.replace(patt, (match) => {
					let arr = match.split(operators[i]);

					return `:{ ${substitutes[i]}: ${arr[1]} }`;
				});
			}

			query = query.replace(/\$\s*\w+|\b(?!true|false|[0-9])\b\w+/mig, function (match) {
				return `"${match}"`;
			});

			return query;
		}
	}
	catch (err) {
		console.log(err);
	}
}