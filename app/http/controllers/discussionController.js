const User = require('../../model/user');
const Question = require('../../model/question');
const Answer = require('../../model/answer');
const Commentreply = require('../../model/commentReply');

function discussionController(){

    return {

        async getQuestion(req,res){
            try {
                let ques = await Question.find({}).populate('author').populate("likes");
               /* return res.status(200).json({
                    message: 'Success',
                    questions : ques
                });*/
                res.render('question.ejs',{
                    questions : ques
                })
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        },
        async getUserQuestion(req,res){
            try {
                let ques = await Question.find({author : req.user._id});
               /* return res.status(200).json({
                    message: 'Success',
                    questions : ques
                });*/
                res.render('question.ejs',{
                    questions : ques
                })
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        },
        async getPartiQuestion(req,res){
            let qId = req.body.id;
            try {
                let ques = await Question.findOne({_id : qId}).populate({
                  path:'answers',
                  populate:{
                    path:'likes',
                  }
                }).populate({
                  path:'answers',
                  populate:{
                    path:'reply',
                    populate:{
                      path:'author'
                    }
                  }
                }).populate({
                  path:'answers',
                  populate:{
                    path:'author',
                  }
                }).populate({
                  path:'question',
                  populate:{
                    path:'likes',
                  }
                }).populate('authors').populate("likes");
                /*return res.status(200).json({
                    message: 'Success',
                    questions : ques
                });*/
                res.render('answer.ejs',{
                    question : ques
                })
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        },
        async getPartialQuestion(req,res){
            let qId = req.params.id;
            try {
                let ques = await Question.findOne({_id : qId}).populate({
                  path:'answers',
                  populate:{
                    path:'likes',
                  }
                }).populate({
                  path:'answers',
                  populate:{
                    path:'reply',
                    populate:{
                      path:'author'
                    }
                  }
                }).populate({
                  path:'answers',
                  populate:{
                    path:'author',
                  }
                }).populate({
                  path:'question',
                  populate:{
                    path:'likes',
                  }
                }).populate('authors').populate("likes");
                /*return res.status(200).json({
                    message: 'Success',
                    questions : ques
                });*/
                res.render('answer.ejs',{
                    question : ques
                })
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        },
        async getQuestionsWithTag(req,res){

        },
        async postQuestion(req,res){

            const {title,content} = req.body;
            if(title == "" || content == "" || title == null || content == null){
                return res.status(500).json({
                    message: 'No fields can be empty'
                });
            }
            else{
                try {
                    let tags = req.body.tags.split(",");

                let newQues = new Question({
                    title : title,
                    content : content,
                    author : req.user._id
                })

                if(tags){
                    tags.forEach(async (tag) =>{
                        let tt = tag.trim();
                       await newQues.tags.push(tt);
                    })
                }

                if(req.files){
                    req.files.forEach( async (file)=>{
                      await newQues.pics.push(file.path);
                    });
                  }

                  await newQues.save();
                  User.findById(req.user._id,async function(err,doc){
                      if(err){
                        return res.status(500).json({
                            message: 'Internal Server error'
                        });
                      }
                      else{
                         await doc.questions.push(newQues._id);
                         await doc.save();
                        /* return res.status(200).json({
                            message: 'Success',
                            question : newQues
                        });*/
                        res.redirect('/getQuestion');
                      }
                  })

                } catch (error) {
                    return res.status(500).json({
                        message: 'Internal Server error'
                    });
                }
            }


        },
        async getAnswer(req,res){
            let qId = req.body.id;
            try {
               let ques = await Question.findById(qId).populate('answers').populate('author');
               return res.status(200).json({
                message: 'Success',
                question : ques
            });
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal Server error'
                });
            }
        },
        async postAnswer(req,res){
            let qId = req.body.id;
            let content = req.body.content;
            console.log(req.files);
            if(content == "" || content == null){
                return res.status(500).json({
                    message: 'No fields can be empty'
                });
            }
            else{
            try {
                Question.findById(qId,async function(err,doc){
                    if(err){
                        return res.status(500).json({
                            message: 'Internal Server error'
                        });
                    }
                    else{
                       let newAnswer = new Answer({
                            content : content,
                            author : req.user._id,
                            question : qId
                       });
                       if(req.files){
                        req.files.forEach(file=>{
                          newAnswer.pics.push(file.path)
                        })
                      }
                      await newAnswer.save()
                              await doc.answers.push(newAnswer._id);
                              await doc.save();
                             /* return res.status(200).json({
                                message: 'Success',
                                question : doc
                            });*/
                            res.redirect('/question/'+qId);
                          }

                    })
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal Server error'
                });
            }
            }
        },
        async likeQuestion(req,res){
            let qId = req.body.id;
            try {
                Question.findById(qId,async function(err,doc){
                        if(err){
                            return res.status(500).json({
                                message: err
                            });
                        }
                        else{
                            let f;
                              if(doc.likes.indexOf(req.user._id) === -1){
                                await doc.likes.push(req.user._id);
                                await doc.save();
                              }

                        /*return res.status(200).json({
                            message: 'Success',
                            article : doc
                        });*/
                        res.redirect('/question/'+qId);
                    }
                });

            } catch (error) {
                return res.status(500).json({
                    message: error.message
                });
            }
        },
        async likeAnswer(req,res){
            let aId = req.body.id;
            let qId=req.body.qid;
            try {
                Answer.findById(aId,async function(err,doc){
                        if(err){
                            return res.status(500).json({
                                message: err
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
                        res.redirect('/question/'+qId);
                    }
                });

            } catch (error) {
                return res.status(500).json({
                    message: error
                });
            }
    },
    async postReply(req,res){
                //console.log(req.body)
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

                        Answer.findById(commentId,async function(err,doc){
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
                            res.redirect('/question/'+req.body.qId);
                        }
                        });
                    } catch (error) {
                        return res.status(500).json({
                            message: error
                        });
                    }
                }
            },
    async editQuestion(req,res){
        let {title,content} = req.body;
        if(title == "" || content == "" || title == null || content == null){
            return res.status(500).json({
                message: 'No fields can be empty'
            });
        }
        else{
            const filter = { _id : id};
                const upd = {title : title,
                            content : content
                     };

                const update = { $set: {
                    ...upd
                }};

        }
    }

    }
}
module.exports = discussionController;
