import Post from "../models/post.model.js";
import axios from "axios";

const makeUniqueSlug = async (title) => {
    let slug = title.replace(/ /g, "-").toLowerCase();
    let existingPost = await Post.findOne({ slug });
    let counter = 2;

    while (existingPost) {
        slug = `${slug}-${counter}`;
        existingPost = await Post.findOne({ slug });
        counter++;
    }

    return slug;
};

const getRandomArticlePhoto = () => {
  const n = Math.floor(Math.random() * 10) + 1; // 1..10
  return `/Article_Photos/photo${n}.jpg`;
};

export const getPosts = async (req, res) => {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5

    const query = {}
    const searchQuery = req.query.search;

    if(searchQuery){
        query.title = {$regex:searchQuery, $options: "i"}
    }

    const posts = await Post.find(query).sort({ createdAt: -1 }).limit(limit).skip((page-1)*limit);

    const totalPosts = await Post.countDocuments(query);
    const hasMore = page * limit < totalPosts;

    res.status(200).json({ posts, hasMore });
};

export const getPost = async (req, res) => {
    const post = await Post.findOne({slug:req.params.slug});
    res.status(200).json(post);
}

export const createPost = async (req, res) => {

    let slug = req.body.title.replace(/ /g, "-").toLowerCase();
    let existingPost = await Post.findOne({ slug });

    let counter = 2;

    while(existingPost){
        slug = `${slug}-${counter}`
        existingPost = await Post.findOne({ slug });
        counter++;
    }

    const img =
        typeof req.body.img === "string" && req.body.img.trim().length > 0
        ? req.body.img.trim()
        : getRandomArticlePhoto();

    const newPost = new Post({ ...req.body, slug, img });

    const post = await newPost.save();
    res.status(200).json(post);
}

export const deletePost = async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id)
    res.status(200).json("Post has been deleted");
}

export const createPostFromAI = async (req, res) => {
    try {
        const topic = req.body?.topic || "";
        const AI_URL = process.env.AI_URL || "http://ai:8000";

        // 1) title + brief (small JSON, easiest for models)
        const titleRes = await axios.post(`${AI_URL}/generate-title`, { topic }, { timeout: 120000 });
        const { title, brief, error: briefError } = titleRes.data || {};

        if (briefError || !title || !brief) {
        return res.status(503).json({
            message: "AI failed to generate title/brief.",
            ai: titleRes.data,
        });
        }

        // 2) desc (conditioned on title+brief)
        const descRes = await axios.post(`${AI_URL}/generate-desc`, { title, brief }, { timeout: 120000 });
        const { desc } = descRes.data || {};
        if (!desc) {
        return res.status(503).json({ message: "AI failed to generate desc.", ai: descRes.data });
        }

        // 3) content (conditioned on title+desc+brief)
        const contentRes = await axios.post(
        `${AI_URL}/generate-content`,
        { title, desc, brief },
        { timeout: 180000 }
        );
        let { content } = contentRes.data || {};
        if (!content) {
        return res.status(503).json({ message: "AI failed to generate content.", ai: contentRes.data });
        }

        // Optional: last defense against base64 images / forbidden tags
        content = String(content)
        .replace(/<\s*img[^>]*>/gi, "")
        .replace(/data:[^"'\s>]+/gi, "")
        .trim();

        // Create DB post
        const slug = await makeUniqueSlug(title);
        const img = getRandomArticlePhoto();

        const newPost = new Post({ title, desc, content, slug, img });
        const saved = await newPost.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "AI post generation failed." });
    }
};