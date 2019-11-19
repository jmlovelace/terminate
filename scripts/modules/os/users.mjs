// Represents a user account on a given machine.
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

// "Default" user for systems where you're not logged in.
const ANONYMOUS = new User('anonymous', '');

export {User, ANONYMOUS};
