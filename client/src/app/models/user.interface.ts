export interface userData {
  success: boolean;
  data: {
    _id: string;
    username: string;
    email: string;
    password: string;
    user_id: string;
    collections: Array<string>;
    profilePicture: string;
  };
}
