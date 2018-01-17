export let hello = (request, h) => {
  let msg = request.query.name == undefined ? 'world' : request.query.name;
  return 'Hello, ' + msg;
};
