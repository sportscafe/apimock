const csvtojson = require("csvtojson");


let adder = (sum, element) => {
	let p = new Promise ((resolve) => {
    resolve(sum + element);
  });

  return p;
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

