import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    console.log("fieldname:", file.fieldname);
    console.log("originalname:", file.originalname);
    console.log("mimetype:", file.mimetype);
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Chỉ cho phép ảnh JPG, PNG hoặc WEBP"));
    }

    cb(null, true);
  },
});
