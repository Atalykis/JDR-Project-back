import { User } from "../../domain/user";

export interface UserStore {
  load(username: string): User | undefined;
  register(user: User): void;
}
