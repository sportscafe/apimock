const csv = require('csvtojson');
const async = require('async');

let adder = (sum, element) => {
	let p = new Promise((resolve) => {
		resolve(sum + element);
	});
	return p;
}

export let loop = (request, h) => {
	let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	let sum = 0;
	var pr = new Promise(function(resolve, reject) {
		async.eachSeries(numbers, (n, cb) => {
			adder(sum, n)
				.then(res => {
					sum = res
					console.log(`Trying to add ${n}`);
					console.log(`Current sum is ${sum}`);
					cb()
				});
		}, function() {
			resolve(sum)
		});
	})
	return pr;
};

export let getTime = (request, h) => {
	return new Date();
}
export let doWork = (request, h) => {
	const data = request.payload;
	const file = data['payload'];
	let arr = [];
	var pr = new Promise((resolve, reject) => {
		csv()
			.fromStream(file)
			.on('csv', (csvRow) => {
				arr.push({
					name: csvRow[0],
					sex: csvRow[1],
					gender: csvRow[2]
				})
			})
			.on('done', (error) => {
				resolve(arr);
			})
	})
	return pr;
}

export let csv2jsonHandler = (request, h) => {
	var date1 = request.pre.timer;
	var date2 = new Date();
	var diffms = date2.getTime() - date1.getTime();
	console.log("Method=", request.method, " Url=", request.url.pathname, " responseTimeMs=", diffms, " statusCode=200");
	return request.pre.m1
};
