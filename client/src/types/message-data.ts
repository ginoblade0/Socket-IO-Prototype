export interface Message {
  _id: string;
  sender: string;
  recipient: string;
  text: string;
  image?: string;
  createdAt: Date;
}

export interface MessageData {
  text: string;
  image: string | null;
}
