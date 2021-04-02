const Commentreply = require('../../model/commentReply');
const User = require('../../model/user');
const Comment = require('../../model/comments');
const Article = require('../../model/article');
const mongoose = require('mongoose');
const { render } = require('ejs');


function articleController(){

    return{

        async getArticle(req,res){

            try {
                let articles = await Article.find({approved : 1}).populate('likes');
               /* return res.status(200).json({
                    message: 'Success',
                    articles : articles
                });*/
                res.render('allArticles.ejs',{
                    articles : articles
                })
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

        },
        async postArticle(req,res){
            let title = req.body.title; let content = req.body.content;
            if(title == "" || content == "" || title == null || content == null){
                return res.status(500).json({
                    message: 'No fields can be empty'
                });
            }
            else{
                try {

                    const newArticle = new Article({
                        title : title,
                        content : content,
                        author : req.user._id
                    });
                   await newArticle.save();

                   User.findById(req.user._id,async function(err,doc){
                    if(err){
                        return res.status(500).json({
                            message: err
                        });
                    }
                    doc.articles.push(newArticle._id);
                    doc.save();
                   /* return res.status(200).json({
                        message: 'Success',
                        user : doc
                    });*/
                    res.redirect('/articles');
                   })
                } catch (error) {
                    return res.status(500).json({
                        message: error
                    });
                }
            }
        },
        async viewArticle(req,res){
            let id = req.params.id;
            try {
                let article = await Article.findById(id).populate("comments");
                res.render('viewArticle',{
                    article : article
                })
            } catch (error) {
                return res.status(500).json({
                    message: error.message
                });
            }
        },
        async likeArticle(req,res){
            let id = req.body.articleId;
            try {
                Article.findById(id,async function(err,doc){
                    if(err){
                        return res.status(500).json({
                            message: error.message
                        });
                    }
                    else{
                        if(doc.likes.indexOf(req.user._id) === -1){
                            await doc.likes.push(req.user._id);
                            await doc.save();
                          }
                          /*return res.status(200).json({
                            message: 'Success',
                            article : doc
                        });*/
                        res.redirect('/articles');
                    }

                })

            } catch (error) {
                return res.status(500).json({
                    message: error
                });
            }
    },
    async likedUsers(req,res){
        let id = req.params.articleId;
        try {
            let users = await Article.findById(id,{likes:1}).populate('likes');
            res.render('viewUsers',{
                users : users.likes
            })
           // console.log(users);
           /* return res.status(200).json({
                message: 'Success',
                users : users
            });*/
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: error
            });
        }
    },
        async individualArticle(req,res){
          let id=req.params.id;
          try {
              let comments = await Article.findById(id,{comments : 1}).populate("comments").populate("likes").populate("author");
              let article= await Article.findById(id);
             /* return res.status(200).json({
                  message: 'Success',
                  comments : comments
              });*/
              var cmnt=[];
              for(var i=0;i<comments.comments.length;i++){
                cmnt.push(await Comment.findById(comments.comments[i]._id).populate("author").populate("likes").populate("reply"));
              }
              console.log(comments.likes);
              res.render('comments',{
                  articleLike: comments.likes,
                  article : article,
                  comments : cmnt
              })
          } catch (error) {
              console.log(error);
              return res.status(500).json({
                  message: error
              });
          }
        },
        async getComment(req,res){
            let id = req.body.articleId;
            try {
                let comments = await Article.findById(id,{comments : 1}).populate("comments").populate("likes").populate("author");
                let article= await Article.findById(id);
               /* return res.status(200).json({
                    message: 'Success',
                    comments : comments
                });*/
                var cmnt=[];
                for(var i=0;i<comments.comments.length;i++){
                  cmnt.push(await Comment.findById(comments.comments[i]._id).populate("author").populate("likes").populate({
                    path:"reply",
                    populate:{
                      path:"author"
                    }
                  }));
                }
              //  console.log(cmnt[0].reply);
                res.render('comments',{
                    articleLike: comments.likes,
                    article : article,
                    comments : cmnt
                })
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: error
                });
            }

        },
        async postComment(req,res){
            let content = req.body.content;
            let articleId = req.body.articleId;
            if(content == "" || content == null){
                return res.status(500).json({
                    message: 'No fields can be empty'
                });
            }
            else{
                try {
                    const newComment = new Comment({
                        content: content,
                        author : req.user._id
                    });
                    await newComment.save();

                    Article.findById(articleId,async function(err,doc){
                        if(err){
                            return res.status(500).json({
                                message: err
                            });
                        }
                        doc.comments.push(newComment._id);
                        doc.save();
                        /*return res.status(200).json({
                            message: 'Success',
                            article : doc
                        });*/
                        res.redirect('/articles');
                    });
                } catch (error) {
                    return res.status(500).json({
                        message: error
                    });
                }
            }
        },
        async likeComment(req,res){
                let id = req.body.commentId;
                console.log(req.body)
                try {

                    Comment.findById(id,async function(err,doc){
                        if(err){
                            return res.status(500).json({
                                message: error.message
                            });
                        }
                        else{
                            if(doc.likes.indexOf(req.user._id) === -1){
                                await doc.likes.push(req.user._id);
                                await doc.save();
                              }
                             /* return res.status(200).json({
                                message: 'Success',
                                comments : doc
                            });*/
                            res.redirect('/article/'+req.body.articleId);
                        }

                    })
                } catch (error) {
                    return res.status(500).json({
                        message: error
                    });
                }
        },
        async getReply(req,res){
            let id = req.body.commentId;
            try {
                let reply = await Comment.findById(id,{reply : 1}).populate("reply");
               /* return res.status(200).json({
                    message: 'Success',
                    replies : reply
                });*/
                //console.log(reply);
                res.render('replies.ejs',{
                    replies : reply.reply
                })
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: error
                });
            }

        },
        async postReply(req,res){
            let content = req.body.content;
            let commentId = req.body.commentId;
            if(content == "" || content == null){
                return res.status(500).json({
                    message: 'No fields can be empty'
                });
            }
            else{
                try {
                    const newCommentReply = new Commentreply({
                        content: content,
                        author : req.user._id
                    });
                    await newCommentReply.save();

                    Comment.findById(commentId,async function(err,doc){
                        if(err){
                            console.log(err);
                            return res.status(500).json({
                                message: err
                            });
                        }
                        else{
                        doc.reply.push(newCommentReply._id);
                         await doc.save();
                       /* return res.status(200).json({
                            message: 'Success',
                            article : doc
                        });*/
                        res.redirect('/articles');
                    }
                    });
                } catch (error) {
                    return res.status(500).json({
                        message: error
                    });
                }
            }
        },
        async editArticle(req,res){
            let {id,title,content} = req.body;
            if(title == "" || content == "" || title != null || content != null){
                return res.status(500).json({
                    message: 'No fields can be empty'
                });
            }
            try {
                const filter = { _id : id};
                const upd = { title : title,
                            content : content
                     };
                const update = { $set: {
                    ...upd
                }};
                    console.log(update);

                let article = await Article.findOneAndUpdate(filter, update, {
                                 new: true
                            });
                res.redirect('..');
            } catch (error) {
                return res.status(500).json({
                    message: error.message
                });
            }
        },
        async editComment(req,res){
           let id = req.body.id; let content = req.body.content;
           if(content == "" || content == null){
               return res.status(500).json({
                   message: 'No fields can be empty'
               });
           }
           try {
               const filter = { _id : id};
               const upd = {
                           content : content
                    };
               const update = { $set: {
                   ...upd
               }};
                   console.log(update);

               let comment = await Comment.findOneAndUpdate(filter, update, {
                                new: true
                           });
               res.redirect('..');
           } catch (error) {
               return res.status(500).json({
                   message: error.message
               });
           }
       },
       async editCommentReply(req,res){
           let id = req.body.id; let content = req.body.content;
           if(content == "" || content == null){
               return res.status(500).json({
                   message: 'No fields can be empty'
               });
           }
           try {
               const filter = { _id : id};
               const upd = {
                           content : content
                    };
               const update = { $set: {
                   ...upd
               }};
                   console.log(update);

               let reply = await Commentreply.findOneAndUpdate(filter, update, {
                                new: true
                           });
               res.redirect('..');
           } catch (error) {
               return res.status(500).json({
                   message: error.message
               });
           }
       }
    }
}

module.exports = articleController;
