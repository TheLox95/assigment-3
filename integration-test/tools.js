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
  },
  defaultUser2: {
    username: "Eve_Lang",
    password: "pas$$",
  },
  defaultUser3: {
    username: "Eve_Start",
    password: "pas$$",
  },
  defaultUser4: {
    username: "Eve_Rogers",
    password: "pas$$",
  },
  defaultUser5: {
    username: "Eve_Romanov",
    password: "pas$$",
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
    registerUser: (usr) => {
      const userToRegister = usr || userGlobal;
      const config = {
        url: `/register`,
        method: 'POST',
        noAuth: true,
        data: {
          username: userToRegister.username,
          password: userToRegister.password,
          email: userToRegister.email,
          firstName: userToRegister.firstName,
          lastName: userToRegister.lastName
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

    clearDb: () => {
      return u.getUsers()
      .then(users => {
        return Promise.all(users.map(usr => u.deleteUser(usr.id)))
      })
      .then(() => {
        return Promise.all([
          u.registerUser({username: 'user', password: "password"}),
          u.registerUser({username: 'user1', password: "password"}),
          u.registerUser(users.defaultUser1),
          u.registerUser(users.defaultUser2),
          u.registerUser(users.defaultUser3),
          u.registerUser(users.defaultUser4),
          u.registerUser(users.defaultUser5),
        ]);
      })
    }
  }
  return u;
}

module.exports = {
  users,
  utils
};