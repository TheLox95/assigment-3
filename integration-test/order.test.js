const utils = require('./utils');

test('should process checkout', (done ) => {
  let product = null;
  const user = utils.defaultUser;

  utils.getUsers()
  .then(u => utils.login(user))
  .then(() => utils.makeRequest({ url: '/catalogue'}))
  .then(res => {
    product = res.data[0];
  })
  .then(() => {
    return utils.makeRequest({
      url: '/cart',
      method: 'post',
      data: {
        id: product.id,
      }
    })
  })
  .then(() => {
    return utils.makeRequest({
      url: '/addresses',
      method: 'post',
      data: {
        number: "55-44",
        street: "baker street 221b",
        city: "London",
        postcode: "56273",
        userID: user.id,
      }
    })
  })
  .then(() => {
    return utils.makeRequest({
      url: '/cards',
      method: 'post',
      data: {
        longNum: "6549841594984984",
        expires: "12/22",
        ccv: 659,
        userID: user.id,
      }
    })
  })
  .then(() => {
    return utils.makeRequest({
      url: '/orders',
      method: 'post',
      user,
      cookie: true,
      noAuth: true,
    })
  })
  .then(() => done())
  //.catch(err => console.log(err.response));
});