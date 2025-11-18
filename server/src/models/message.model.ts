import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    image: { type: String },
    // read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

export default Message;
