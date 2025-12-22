import { Response } from "express";
import { Request } from "../types/express";
import ContactSettings from "../models/contact-settings.model";

// export const getContactSettings = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user._id;
//     const contactId = req.params.id;

//     const contactSettings = await ContactSettings.findOne({
//       userId: userId,
//       contactId: contactId,
//     });
//   } catch (error) {}
// };

// export const updateContactSettings = async (req: Request, res: Response) => {
//   try {
//     const { contactId, isMuted, nickname } = req.body;

//     const updateData: any = { isMuted };
//     if (nickname !== undefined) updateData.nickname = nickname;

//     const updatedSettings = await ContactSettings.findOneAndUpdate(
//       {
//         userId: req.user._id,
//         contactId: contactId,
//       },
//       {
//         $set: updateData,
//       },
//       { new: true, upsert: true }
//     );

//     res.status(200).json(updatedSettings);
//   } catch (e) {
//     res.status(500).json({
//       message: e instanceof Error ? e.message : "An unknown error occurred.",
//     });
//   }
// };

export const updateContactSettings = async (req: Request, res: Response) => {
  try {
    const contactId = req.params.id;
    const { isMuted, nickname } = req.body;

    if (!contactId) {
      return res.status(400).json({ message: "contactId is required" });
    }

    const currentSettings = await ContactSettings.findOne({
      userId: req.user._id,
      contactId,
    });

    if (!currentSettings) {
      const newSettings = await ContactSettings.create({
        userId: req.user._id,
        contactId,
        isMuted,
        nickname,
      });
      return res.status(201).json(newSettings);
    }

    const hasChanges =
      currentSettings.isMuted !== isMuted ||
      (nickname !== undefined && currentSettings.nickname !== nickname);

    if (!hasChanges) {
      return res.status(200).json(currentSettings);
    }

    const updateData: any = {};
    if (currentSettings.isMuted !== isMuted) updateData.isMuted = isMuted;
    if (nickname !== undefined && currentSettings.nickname !== nickname)
      updateData.nickname = nickname;

    const updatedSettings = await ContactSettings.findByIdAndUpdate(
      currentSettings._id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json(updatedSettings);
  } catch (e) {
    console.error("Error updating contact settings:", e);
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};
