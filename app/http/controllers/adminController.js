const Job = require('../../model/job');
const Video = require('../../model/video');
const Article = require('../../model/article');

function adminController(){
    return {

        async getAdminJobs(req,res){
            try {
                let jobs = await Job.find({approved : 0});
                /*return res.status(200).json({
                    jobs : jobs
                });*/
                res.render('adminJobs',{
                    jobs : jobs
                })
            } catch (error) {
                return res.status(500).json({
                    message: error
                });
            }
        },
        async postAdminJobs(req,res){
            let id = req.body.id;
        let val = req.body.val;
        if(val == 'true'){
            Job.updateOne({_id : id},{$set : {approved:1}},function(err,doc){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect('/adminJobs');
                }
            });
        }
        else{
            Job.deleteOne({_id:id},function(err){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect('/adminJobs');
                }
            })
        }
        },
        async getAdminVideos(req,res){
            try {
                let videos = await Video.find({approved : 0});
               /* return res.status(200).json({
                    videos : videos
                });*/
                res.render('adminVideos',{
                    videos : videos
                })
            } catch (error) {
                return res.status(500).json({
                    message: error
                });
            }
        },
        async postAdminVideos(req,res){
            let id = req.body.id;
        let val = req.body.val;
        if(val == 'true'){
            Video.updateOne({_id : id},{$set : {approved:1}},function(err,doc){
                if(err){
                    console.log(err);
                }
                else{
                res.redirect('adminVideos');
                }
            });
        }
        else{
            Video.deleteOne({_id:id},function(err){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect('adminVideos');
                }
            })
        }
        },
        async getAdminArticle(req,res){
            try {
                let articles = await Article.find({approved : 0});
               /* return res.status(200).json({
                    articles : articles
                });*/
                res.render('adminArticles',{
                    articles : articles
                })
            } catch (error) {
                return res.status(500).json({
                    message: error.message
                });
            }
        },
        async postAdminArticle(req,res){
            let id = req.body.id;
        let val = req.body.val;
        if(val == 'true'){
            Article.updateOne({_id : id},{$set : {approved:1}},function(err,doc){
                if(err){
                    console.log(err);
                }
                else{
                    res.render('/adminArticles');
                }
            });
        }
        else{
            Article.deleteOne({_id:id},function(err){
                if(err){
                    console.log(err);
                }
                else{
                    res.render('/adminArticles');
                }
            })
        }
        }
    }
}

module.exports = adminController;