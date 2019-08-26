const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let CrudSchema = new Schema({
	user_id: { type: Number, min: 1 },
	has_depositted: Boolean,
	wallet_balance: Number,
	number_of_deposits: Number
});

//Indexes
CrudSchema.index({ "has_depositted" : 1, "wallet_balance" : 1, "number_of_deposits": 1 });
CrudSchema.index({ "has_depositted" : 1, "number_of_deposits": 1 });
CrudSchema.index({ "wallet_balance" : 1, "number_of_deposits": 1 });
CrudSchema.index({ "number_of_deposits": 1 });

let Crud = mongoose.model('Crud', CrudSchema);

//Mongoose will emit an index event on the model when indexes are done building or an error occurred.
Crud.on('index', function(error) {
	if (error) console.log(error);
	else console.log("Index Created");
});

module.exports = Crud;