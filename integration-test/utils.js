const axios = require('axios');

const utils = {
  path: `http://${process.env.HOST_URL}`,
  username: "Lasfeo",
  password: "paasf$$",
  email: "leo@hotmail.com",
  firstName: "detymreo",
  lastName: "lsetmrhbo",
  credential: () => Buffer.from(`${utils.username}:${utils.password}`).toString('base64'),
  registerUser: () => {
    const config = {
      url: `/register`,
      method: 'POST',
      noAuth: true,
      data: {
        username: utils.username,
        password: utils.password,
        email: utils.email,
        firstName: utils.firstName,
        lastName: utils.lastName
      },
    };
    return utils.makeRequest(config);
  },
  getUsers: () => {
    return utils.makeRequest({
      url: '/customers',
    })
    .then(response => response.data._embedded.customer)
  },
  makeRequest: (obj) => {
    const config = {
      url: `${utils.path}${obj.url}`,
      method: obj.method ? obj.method.toUpperCase() : "GET",
      data: obj.data ? obj.data : null,
      headers: obj.headers ? obj.headers : {},
    }
    if (!obj.noAuth) {
      config.headers = {...config.headers, Authorization: `Basic ${utils.credential()}`};
    }
    return axios(config);
  },
  getOrders: () => {
    if (!utils.credentials) {
      return Promise.reject(new Error('User is not logged'));
    }
  }
}

module.exports = utils;