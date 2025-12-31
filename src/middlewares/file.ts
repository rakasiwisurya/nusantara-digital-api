import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { responseUnprocessableEntity } from "../libs/response";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.originalname.match(/\.csv$/i)) {
    req.fileValidationError = "Only csv file is allowed";
    return cb(null, false);
  }

  cb(null, true);
};

const multerSetup = multer({
  storage,
  fileFilter,
});

export const upload = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    multerSetup.single(fieldName)(req, res, (err) => {
      if (err) return responseUnprocessableEntity(res, err.message);
      next();
    });
  };
};
