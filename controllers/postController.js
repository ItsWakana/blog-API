const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

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

const validateBlogPostComment = [
    body("comment")
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

const blogPostComment_post = async (req, res) => {

    const { user } = req.user;

    const { comment, blogData } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const newComment = new Comment({
        content: comment,
        createdAt: new Date(),
        author: user._id
    });

    //SAVE COMMENT TO DATABASE.
    await newComment.save();

    await Post.findByIdAndUpdate(blogData._id, { $push: { comments: newComment._id }});

    const populatedComment = await Comment.findById(newComment._id).populate("author").exec();
    
    res.json(populatedComment);

}

module.exports = {
    blogPost_post,
    blogPostComment_post,
    validateBlogPost,
    validateBlogPostComment
}