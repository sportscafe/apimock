const csvtojson = require("csvtojson");
const ip = require('ip');
const {promisify} = require('util');
const redis = require("redis");
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);


let adder = (sum, element) => {
	let p = new Promise ((resolve) => {
    resolve(sum + element);
  });

  return p;
}

//Returns client IP address
let getClientIp = (req) => {
  var ipAddress;
  // The request may be forwarded from local web server.
  var forwardedIpsStr = req.headers['x-forwarded-for']; 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // If request was not forwarded
    ipAddress = req.info.remoteAddress;
  }

  return ipAddress;
}

//calcDelay calculates the delay time after which res will send to client
let calcDelay = (totalHits) => {
  let promise = new Promise ((resolve) => {
    let hit = parseInt(totalHits);

    resolve((hit - 1) + hit);
  });
  
  return promise;
}

//calcResponse to get res which will send after delay 
let calcResponse = (totalHits, delay) => {
  let promise = new Promise ((resolve) => {
    setTimeout(() => resolve(2 ** totalHits), delay * 1000);
  });

  return promise;
}

export let loop = async (request, h) => {
  try {
    let numbers = [1,2,3,4,5,6,7,8,9,10];
    let sum = 0;
    
    for (let n = 1; n <= numbers.length; n++) {
      console.log(`Trying to add ${n}`);

      var res = await adder(sum, n);
      console.log(`Current sum is ${res}`);
      sum = res;
    }
    
    return sum;
  }
  catch (err) {
    console.error(err);
  }
};

export let csvToJSON = async (request) => {
  try {
    let file = request.payload.file;

    let jsonArray = await csvtojson().fromString(file);

    return jsonArray; //returns json res
  }
  catch (err) {
    console.error(err);
  }
};

export let dynamicDelay = async (request) => {
  try {
    let ipAdd = getClientIp(request);
    let key = ip.toLong(ipAdd);

    //Get val of key from redis
    let value = await getAsync(key);

    if (!value) {
      await setAsync(key, 1, 'EX', 5 * 60);
      value = 1;
    }

    //Each time val of key increase by 1 in redis
    client.incr(key);

    let delay = await calcDelay(value);
    console.log(`delay ${delay} second`);
    //Promise will resolve after a delay
    let response = await calcResponse(value, delay);
    
    return response;
  }
  catch (err) {
    console.log(err);
  }
};



