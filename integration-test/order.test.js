const tools = require('./tools');

const addressData = {
  number: "55-44",
  street: "baker street 221b",
  city: "London",
  postcode: "56273",
};

const cardData = {
  longNum: "6549841594984984",
  expires: "12/22",
  ccv: "659",
};

jest.setTimeout(30000);
afterAll(() => {
  const t = tools.utils(tools.users.defaultUser1);
  return t.clearDb();
});

test('should process checkout', (done ) => {
  let ordersAmmo = null;

  const username = `Eve${Math.random().toString(36).substring(7)}`;
  const u = {
    username: username,
    password: "pa$$",
    email: `username@hotmail.com`,
  };

  const utils = tools.utils(u);

  utils.registerUser()
  .then(() => utils.login())
  .then(() => utils.getOrders())
  .then(orders => ordersAmmo = orders.length)
  .then(() => utils.makeRequest({ url: '/catalogue'}))
  .then(res => res.data[0])
  .then((product) => {
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
      cookie: true,
      method: 'post',
      data: addressData
    })
  })
  .then(() => {
    return utils.makeRequest({
      url: '/cards',
      cookie: true,
      method: 'post',
      data: cardData
    })
  })
  .then(() => {
    return utils.makeRequest({
      url: '/orders',
      method: 'post',
      cookie: true,
      noAuth: true,
    })
  })
  .then(() => utils.getOrders())
  .then(orders => {
    expect(orders.length).toBe(ordersAmmo + 1);
    done();
  })
  .catch(err => console.log(err));
});


test('should fail when user has no card saved', (done ) => {

  const utils = tools.utils(tools.users.defaultUser2)

  utils.login()
  .then(() => utils.makeRequest({ url: '/catalogue'}))
  .then(res => res.data[0])
  .then((product) => {
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
      cookie: true,
      method: 'post',
      data: addressData
    })
  })
  .then(() => {
    return utils.makeRequest({
      url: '/orders',
      method: 'post',
      cookie: true,
      noAuth: true,
    })
  })
  .catch(err => {
    expect(err.response.status).toBe(406);
    expect(err.response.data.message).toBe('Invalid order request. Order requires customer, address, card and items.');
    done()
  });
});


test('should fail when user has no address saved', (done ) => {
  const utils = tools.utils(tools.users.defaultUser3)

  utils.login()
  .then(() => utils.makeRequest({ url: '/catalogue'}))
  .then(res => res.data[0])
  .then((product) => {
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
      url: '/cards',
      cookie: true,
      method: 'post',
      data: cardData
    })
  })
  .then(() => {
    return utils.makeRequest({
      url: '/orders',
      method: 'post',
      cookie: true,
      noAuth: true,
    })
  })
  .catch(err => {
    expect(err.response.status).toBe(406);
    expect(err.response.data.message).toBe('Invalid order request. Order requires customer, address, card and items.');
    done()
  });
});

test('should fail when user has no items on cart', (done ) => {
  const utils = tools.utils(tools.users.defaultUser4)

  utils.login()
  .then(() => {
    return utils.makeRequest({
      url: '/cards',
      cookie: true,
      method: 'post',
      data: cardData
    })
  })
  .then(() => {
    return utils.makeRequest({
      url: '/orders',
      method: 'post',
      cookie: true,
      noAuth: true,
    })
  })
  .catch(err => {
    expect(err.response.status).toBe(406);
    expect(err.response.data.message).toBe('Invalid order request. Order requires customer, address, card and items.');
    done()
  });
});
