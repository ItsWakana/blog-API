const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");

const validateBlogPost = [
    body("title")
        .trim()
        .not()
        .isEmpty(),
    body("postContent")
        .trim()
        .not()
        .isEmpty()
];

const blogPost_post = async (req, res) => {

    const { user } = req.user;

    if (!user.isAdmin) {
        return res.status(403).json({ message: "Invalid permissions for post creation"});
    }

    const {
        title,
        postContent
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const newPost = new Post({
        title,
        content: postContent,
        author: user._id,
        createdAt: new Date(),
        editedAt: new Date(),
        published: { 
            isPublished: false
        }
    });

    newPost.save();
    res.json(newPost);
}

module.exports = {
    blogPost_post,
    validateBlogPost
}