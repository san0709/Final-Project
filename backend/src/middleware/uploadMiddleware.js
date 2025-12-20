import multer from 'multer';
import path from 'path';

// storage setup
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// file type check
function fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png|mp4|mov|avi/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb('Images & videos only!');
    }
}

const upload = multer({
    storage,
    fileFilter,
});

export default upload;
