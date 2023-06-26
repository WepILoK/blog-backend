import express from "express"
import mongoose from "mongoose"
import multer from "multer";
import cors from "cors"

import {loginValidator, postValidator, registerValidator} from "./src/validations/validations.js";
import {checkAuth, handleValidationErrors} from "./src/utils/index.js";
import {UserController, PostController} from "./src/controllers/index.js"


mongoose.connect("mongodb+srv://WepJIoK:123456789w@cluster0.nkfzlbg.mongodb.net/blogDB?retryWrites=true&w=majority")
    .then(() => console.log('blogDB connected'))
    .catch((err) => console.log('blogDB error', err))


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/uploads")
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})
const upload = multer({storage})


const app = express()
app.use(express.json())
app.use(cors())


app.use("/uploads", express.static("src/uploads"))

app.post("/auth/register", registerValidator, handleValidationErrors, UserController.register)

app.post("/auth/login", loginValidator, handleValidationErrors, UserController.login)

app.get("/auth/me", checkAuth, UserController.getMe)


app.post("/posts", postValidator, handleValidationErrors, checkAuth, PostController.create)

app.get('/posts/last-tags', PostController.getLastTags)

app.get("/posts", PostController.getAll)

app.get("/posts/:id", PostController.getById)

app.patch("/posts/:id", postValidator, handleValidationErrors, checkAuth, PostController.update)

app.delete("/posts/:id", checkAuth, PostController.remove)


app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            res.status(404).json({
                status: "error",
                message: "upload.error",
            })
            return
        }

        //@ts-ignore
        if (!["image/jpeg", "image/png", "image/svg+xml"].includes(req.file.mimetype)) {
            res.status(404).json({
                status: "error",
                message: "upload.incorrect_file_extension",
            })
            return
        }

        res.status(200).json({
            status: "success",
            message: "upload.success",
            data: {
                url: `/uploads/${req.file?.originalname}`
            }
        })

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "upload.error",
        })
    }
})

//@ts-ignore
app.listen(8888, (err) => {
    if (err) {
        return console.log(err)
    } else {

        console.log('Server start')
    }
})