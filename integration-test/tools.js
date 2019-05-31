const axios = require('axios');

const users = {
  newUser: {
    username: "Leo",
    password: "pa$$",
    email: "leo@hotmail.com",
    firstName: "Leo",
    lastName: "Last",
  },
  defaultUser1: {
    username: "Eve_Berger",
    password: "eve",
    id: "57a98d98e4b00679b4a830af",
  },
}

function utils(userGlobal) {
  const u = {
    cookies: [],
    path: `http://${process.env.HOST_URL}`,
    credential: () => Buffer.from(`${userGlobal.username}:${userGlobal.password}`).toString('base64'),
    deleteUser: (id) => {
      return u.makeRequest({
        url: `/customers/${id}`,
        method: "delete",
      });
    },
    registerUser: () => {
      const config = {
        url: `/register`,
        method: 'POST',
        noAuth: true,
        data: {
          username: userGlobal.username,
          password: userGlobal.password,
          email: userGlobal.email,
          firstName: userGlobal.firstName,
          lastName: userGlobal.lastName
        },
      };
      return u.makeRequest(config);
    },
    login: () => {
      return u.makeRequest({
        url: '/login',
      })
      .then(r => {
        utils.cookies = r.headers["set-cookie"].map(cookie => cookie.trim());
  
        return r;
      });
    },
    getUsers: () => {
      return u.makeRequest({
        url: '/customers',
      })
      .then(response => response.data._embedded.customer)
    },
    makeRequest: (obj) => {
      const config = {
        url: `${u.path}${obj.url}`,
        method: obj.method ? obj.method.toUpperCase() : "GET",
        data: obj.data ? obj.data : null,
        headers: obj.headers ? obj.headers : {},
      }
      if (!obj.noAuth) {
        config.headers = {...config.headers, Authorization: `Basic ${u.credential()}`};
      }
      if (obj.cookie) {
        config.headers = {...config.headers, cookie: utils.cookies.join(';')};
      }
      return axios(config);
    },
    getOrders: () => {
      return u.makeRequest({
        url: '/orders',
        method: 'get',
        cookie: true,
      }).then(data => data.data)
    },
    getCards: () => {
      return u.makeRequest({
        url: '/cards',
      }).then(res => res.data._embedded.card)
    },
    deleteCard: (card) => {
      return u.makeRequest({
        url: `/cards/${card.id}`,
        method: 'delete',
      })
    },
    getAddresses: () => {
      return u.makeRequest({
        url: '/addresses',
      }).then(res => res.data._embedded.address)
    },
    deleteAddress: (address) => {
      return u.makeRequest({
        url: `/addresses/${address.id}`,
        method: 'delete',
      })
    },
  }
  return u;
}

module.exports = {
  users,
  utils
};