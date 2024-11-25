import { User } from "src/app/users/users.entity";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
