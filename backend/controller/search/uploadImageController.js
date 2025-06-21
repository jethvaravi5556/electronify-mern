import multer from "multer";

const storage = multer({ dest: "uploads/" });
export const uploadImageController = storage.single("image");
