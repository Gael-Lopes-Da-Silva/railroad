import multer from 'multer';

const storage = multer.memoryStorage(); // uses in-memory storage so that files are stored in buffer
const upload = multer({ storage: storage }); // configure Multer to process uploaded images

export default upload;
