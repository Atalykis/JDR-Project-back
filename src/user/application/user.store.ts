import { User } from "../domain/user";

export interface UserStore {
  load(username: string): Promise<User | undefined>;
  register(user: User): Promise<void>;
}
