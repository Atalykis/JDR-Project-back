import { User } from "../../domain/user";
import { UserStore } from "./user.store";

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
