const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/central_database', {useNewUrlParser: true});

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Database connection error.'));

db.once('open', function callback() {
    console.log('Connection established with database.');
});


exports.db = db;