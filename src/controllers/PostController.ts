import express from "express";
import PostModel from "../models/Post.js";

export const PostController = {
    create: async (req: any, res: express.Response) => {
        try {

            const doc = new PostModel({
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            })

            const post: any = await doc.save()

            res.status(200).json({
                status: "success",
                message: "post.create.success",
                bata: post,
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                message: "post.create.failed",
            })
        }
    },
    getAll: async (req: express.Request, res: express.Response) => {
        try {

            const posts: any = await PostModel.find()
                .populate('user', ["email", "fullName", "avatarUrl"])
                .exec()

            res.status(200).json({
                status: "success",
                message: "post.getAll.success",
                bata: posts,
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                message: "post.getAll.failed",
            })
        }
    },
    getById: async (req: express.Request, res: express.Response) => {
        try {

            const post: any = await PostModel.findOneAndUpdate(
                {
                    _id: req.params.id,
                },
                {
                    $inc: {viewsCount: 1}
                },
                {
                    returnDocument: "after"
                }
            ).populate('user', ["email", "fullName", "avatarUrl"])
                .exec()

            if (!post) {
                res.status(404).json({
                    status: "error",
                    message: "post.notfound",
                })
                return
            }

            res.status(200).json({
                status: "success",
                message: "post.getById.success",
                bata: post,
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                message: "post.getById.failed",
            })
        }
    },
    update: async (req: express.Request, res: express.Response) => {
        try {

            const post: any = await PostModel.findOneAndUpdate(
                {
                    _id: req.params.id,
                },
                {
                    title: req.body.title,
                    text: req.body.text,
                    imageUrl: req.body.imageUrl,
                    tags: req.body.tags,
                }
            ).populate('user', ["email", "fullName", "avatarUrl"])
                .exec()

            if (!post) {
                res.status(404).json({
                    status: "error",
                    message: "post.notfound",
                })
                return
            }

            res.status(200).json({
                status: "success",
                message: "post.update.success",
                data: post
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                message: "post.update.failed",
            })
        }
    },
    remove: async (req: express.Request, res: express.Response) => {
        try {

            const post: any = await PostModel.findOneAndDelete(
                {
                    _id: req.params.id,
                }
            )

            if (!post) {
                res.status(404).json({
                    status: "error",
                    message: "post.notfound",
                })
                return
            }

            res.status(200).json({
                status: "success",
                message: "post.remove.success",
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                message: "post.remove.failed",
            })
        }
    },
}