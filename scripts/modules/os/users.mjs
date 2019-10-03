// Represents a user account on a given machine.
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

// "default" user for system where you're logged in
const ANONYMOUS = new User('anonymous', '');

export {User, ANONYMOUS};