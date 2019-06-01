const tools = require('./tools');

jest.setTimeout(30000);
afterAll(() => {
  const t = tools.utils(tools.users.defaultUser1);
  return t.clearDb();
});

test('user should Register fine', (done ) => {
  let userAmmo = 0;

  const utils = tools.utils(tools.users.newUser);

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
  const utils = tools.utils(tools.users.newUser);

  utils.login()
  .then(r => {
      expect(r).not.toBe(null);
      done();
    })
  .catch(err => console.log(err));
});

test('user should Delete fine', (done ) => {
  let userAmmo = 0;
  let newUserId = null;
  const utils = tools.utils(tools.users.newUser);

  utils.getUsers()
  // get register users amount
  .then(users => {
    userAmmo = users.length;
    newUserId = users.find(u => u.username == tools.users.newUser.username).id;
  })
  // delete last user created
  .then(() => utils.deleteUser(newUserId))
  .then(() => utils.getUsers())
  // get user created amount
  .then(users => {
    expect(users.length).toBe(userAmmo - 1);
    done();
  })
  .catch(err => console.log(err));
});