import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import {registerValidator} from "./validations/validations.js";
import {validationResult} from "express-validator";
import UserModel from "./models/User.js";
import {checkAuth} from "./utils/checkAuth.js";

mongoose.connect("mongodb+srv://WepJIoK:123456789w@cluster0.nkfzlbg.mongodb.net/blogDB?retryWrites=true&w=majority")
    .then(() => console.log('blogDB connected'))
    .catch((err) => console.log('blogDB error', err))

const app = express()

app.use(express.json())

app.post('/auth/login', async (req: express.Request, res: express.Response) => {
    try {
        const user: any = await UserModel.findOne({email: req.body.email})
        if (!user) {
            res.status(400)
                .json({
                    status: "error",
                    message: "authorization.login.failed",
                })
            return
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            res.status(400)
                .json({
                    status: "error",
                    message: "authorization.login.failed",
                })
            return
        }

        const token = jwt.sign(
            {
                _id: user._id,
                role: req.body.role,
            },
            "secretCode",
            {
                expiresIn: "30d"
            }
        )

        const {passwordHash, __v, createdAt, updatedAt, ...userData} = user._doc

        res.status(200).json({
            status: "success",
            message: "authorization.login.success",
            bata: userData,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "error",
            message: "authorization.login.failed",
        })
    }
})

app.post("/auth/register", registerValidator, async (req: express.Request, res: express.Response) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                message: errors.array()[0].msg
            })
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        })

        const user: any = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id,
                role: req.body.role,
            },
            "secretCode",
            {
                expiresIn: "30d"
            }
        )

        const {passwordHash, __v, createdAt, updatedAt, ...userData} = user._doc

        res.status(200).json({
            status: "success",
            message: "authorization.register.success",
            bata: userData,
            token
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "error",
            message: "authorization.register.failed",
        })
    }
})

app.get("/auth/me", checkAuth, async (req: any, res: express.Response) => {
    try {
        const user: any = await UserModel.findById(req.userId)

        if (!user) {
            res.status(404).json({
                status: "error",
                message: "authorization.me.notfound",
            })
            return
        }
        const {passwordHash, __v, createdAt, updatedAt, ...userData} = user._doc

        res.status(200).json({
            status: "success",
            message: "authorization.me.success",
            bata: userData,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "error",
            message: "authorization.me.failed",
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