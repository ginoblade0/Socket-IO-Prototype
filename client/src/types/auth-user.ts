export interface AuthUser {
  _id: any;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
}

// export type Contact = Pick<AuthUser, "_id" | "username" | "avatar">;

export interface Contact {
  _id: any;
  username: string;
  avatar: string;
  lastMsg: string;
  isSender: boolean;
  isMuted: boolean;
  nickname: string;
}
