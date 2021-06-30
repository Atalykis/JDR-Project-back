import { UserStore } from "../../application/user.store";
import { User } from "../../domain/user";

export class UserStoreInMemory implements UserStore {
  private users: User[] = [];
  load(username: string) {
    const user = this.users.find((user) => user.username === username);
    return user;
  }

  register(user: User) {
    this.users.push(user);
  }
}
