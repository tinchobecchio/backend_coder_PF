import { Router } from "express"

import { changeRole, uploadFiles } from "../controllers/users.controller.js";
import { uploader } from "../utils/multer.js";

const usersRouter = new Router();

usersRouter.put('/premium/:uid', changeRole)

usersRouter.post('/:uid/documents', 
    uploader.fields([{name: 'documents-id'}, {name: 'documents-address'}, {name: 'documents-account'}, {name: 'profiles'}, {name: 'products'}]), 
    uploadFiles
)

export default usersRouter;
