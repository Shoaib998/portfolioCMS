import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    let folder = "uploads";

    if (file.fieldname === "profileImage") {
      folder = "uploads/profiles";
    }

    if (file.fieldname === "resume") {
      folder = "uploads/resumes";
    }

    if (file.fieldname === "projectImage") {
      folder = "uploads/projects";
    }

    if (file.fieldname === "blogImage") {
      folder = "uploads/blogs";
    }

    if (file.fieldname === "galleryImage") {
      folder = "uploads/gallery";
    }

    if (file.fieldname === "logo") {
      folder = "uploads/settings";
    }

    if (file.fieldname === "favicon") {
      folder = "uploads/settings";
    }

    if (file.fieldname === "testimonialAvatar") {
      folder = "uploads/testimonials";
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename(req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// Image filter
const imageFileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG and WEBP images are allowed"));
  }
};

// Resume filter
const resumeFileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC and DOCX files are allowed"));
  }
};

// Image upload
export const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Resume upload
export const resumeUpload = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});