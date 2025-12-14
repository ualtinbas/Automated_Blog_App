import express from "express"
import { getPosts, getPost, createPost, deletePost, createPostFromAI } from "../controllers/post.controller.js";

const router = express.Router()

router.get("/", getPosts);
router.post("/ai", createPostFromAI);
router.get("/:slug", getPost);
router.post("/", createPost);
router.delete("/:id", deletePost);

export default router