import multer from "multer";
let storage = multer.diskStorage({
  destination: process.cwd() + "/public/img", // nơi định nghĩa đường dẫn
  filename: (req, file, callback) => {
    let newName = new Date().getTime() + "-" + file.originalname;
    callback(null, newName);
  },
});

let upload = multer({ storage });

export default upload;