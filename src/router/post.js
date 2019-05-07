const express     = require('express');
const router      =  new express.Router()
const Post        = require('../model/post')
const {ObjectID}  = require('mongodb')

const authenticate  = require('../middleware/auth')

// Create Post 
router.post('/posts',authenticate,async (req,res) => {
    const post =  new Post({
        ...req.body,
        author: req.user._id
    })
    try {
        await post.save()
        res.status(201).send(post)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Read All Post

router.get('/posts',async (req,res) => {
    try {
        const posts = await Post.find({})
        res.send(posts)
    } catch (error) {
        res.status(500).send()
    }
})
// read A single Post BY ID
router.get('/posts/:id',authenticate, async (req,res) => {
    const _id =  req.params.id
    if (!ObjectID.isValid(_id)) {
        return res.status(404).send();
    }
    try {
        const post = await Post.findOne({ _id, author: req.user._id })
        if(!post){
            return res.status(404).send()
        }
        res.send(post);
    } catch (error) {
        res.status(500).send()
    }
})

// Edit Post
router.patch('/posts/:id',authenticate, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "title"]
    const isValidOperation  = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(400).send({error:'Invalid updates'})
    }
    if (!ObjectID.isValid(_id)) {
        res.status(404).send();
    }
    try {
        const post = await Post.findOne({_id: req.params.id, author:req.user._id})
        
       if(!post){
        res.status(404).send();
       }

       updates.forEach((update) => post[update] = req.body[update])
       await post.save()

       res.send(post);
    } catch (error) {
        res.status(400).send();
    }
})
// Delete Post 
router.delete('/posts/:id', authenticate,async (req,res) => {
    const _id = req.params.id
    if (!ObjectID.isValid(_id)) {
        return res.status(404).send();
    }
    try {
        const deletepost = await Post.findOneAndDelete({_id:_id, author: req.user._id})
        if (!deletepost) {
            return res.status(404).send();
        }
        res.send(deletepost)
    } catch (error) {
        res.status(500).send()
    }
})
//get all the comments related to the post
router.get('/posts/:id/comment', async (req,res) => {
    try {
        const post = await Post.findOne({_id: req.params.id})
        await post.populate('comments').execPopulate()
        res.send(post.comments)
    } catch (error) {
        res.status(500).send()
    }
})
// Edit Comment
router.post('/posts/:id/comment',authenticate, async (req,res) => {   
    const _id = req.params.id
    const userid = req.user._id

    if (!ObjectID.isValid(_id)) {
        return res.status(404).send();
    }

    if (!ObjectID.isValid(userid)) {
        return res.status(404).send();
    }

    const comment = new Comment({
        ...req.body,
        author: userid,
        postId: _id
    })

    try {
        await comment.save()
        res.status(201).send(comment)
    } catch (error) {
        res.status(400).send(error)
    }

})

module.exports = router