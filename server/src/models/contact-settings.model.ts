import { Schema, model } from "mongoose";

const contactSettingsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    contactId: { type: Schema.Types.ObjectId, required: true },
    isMuted: { type: Boolean, default: false },
    nickname: { type: String, default: "", trim: true, maxlength: 26 },
  },
  { timestamps: true }
);
contactSettingsSchema.index({ userId: 1, contactId: 1 }, { unique: true });

const ContactSettings = model(
  "ContactSettings",
  contactSettingsSchema,
  "contact_settings"
);

export default ContactSettings;
