export interface UserPayload {
  id: number;
}

export class UserResponse {
  id!: string;
  name!: string;
  email!: string;
  role!: string;
}