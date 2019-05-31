const utils = require('./utils');

test('user should Register fine', (done ) => {
  let userAmmo = 0;

  // get current amount of user registers
  utils.getUsers()
  .then((users) => {userAmmo = users.length})
  // register new user
  .then(() => utils.registerUser())
  .then(() => utils.getUsers())
  // check user amount
  .then(users => {
    expect(users.length).toBe(userAmmo + 1);
    done();
  })
  .catch(err => console.log(err));
});

test('user should Login fine', (done ) => {
  utils.makeRequest({
    url: '/login',
  })
  .then(r => {
      console.log(r);
      expect(r).not.toBe(null);
      done();
    });
});

test('user should Delete fine', (done ) => {
  let userAmmo = 0;
  utils.getUsers()
  // get register users amount
  .then(users => {
    userAmmo = users.length;
    return users[users.length -1];
  })
  // delete last user created
  .then((lastUser) => {
    return utils.makeRequest({
      url: `/customers/${lastUser.id}`,
      method: "delete",
    });
  })
  .then(() => utils.getUsers())
  // get user created amount
  .then(users => {
    expect(users.length).toBe(userAmmo - 1);
    done();
  })
  .catch(err => console.log(err));
});