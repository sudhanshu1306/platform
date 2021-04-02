const authController = require('../app/http/controllers/authController');
const employerController = require('../app/http/controllers/employerController');
const adminController = require('../app/http/controllers/adminController');
const articleController = require('../app/http/controllers/articleController');
const courseAuthorController = require('../app/http/controllers/courseAuthorController');
const discussionController = require('../app/http/controllers/discussionController');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');
const student = require('../app/http/middlewares/student');
const employer = require('../app/http/middlewares/employer');
const notStudent = require('../app/http/middlewares/notStudent');
const notEmployer = require('../app/http/middlewares/notEmployer');
const registered = require('../app/http/middlewares/registered');
const passport = require('passport');
const guest = require('../app/http/middlewares/guest');
const multer=require('multer');
const Article = require('../app/model/article');

function initRoute(app) {

  app.get('/',function(req,res){
    res.redirect('/jobs');
  })

  app.get('/login', function(req,res){
      res.render("login");
  })

    app.post('/login', authController().postLogin)

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
          var ext=file.mimetype.substring(file.mimetype.indexOf("/")+1);
          cb(null, Date.now() +"."+ ext) //Appending extension
        }
      });

      const uploadDp=multer({storage:storage,
        fileFilter: function (req, file, callback) {
          var ext = file.mimetype;
          if(ext !== 'image/png' && ext !== 'image/jpg' && ext !== 'image/jpeg') {
              return callback(new Error('Only images are allowed'))
          }
          callback(null, true)
      },
      limits:{
          fileSize: 1024 * 1024
      }});
      const dp =uploadDp.single('pic');

      const uploadQa=multer({storage:storage,
        fileFilter: function (req, file, callback) {
          var ext = file.mimetype;
          if(ext !== 'image/png' && ext !== 'image/jpg' && ext !== 'image/gif' && ext !== 'image/jpeg') {
              return callback(new Error('Only images are allowed'))
          }
          callback(null, true)
      },
      limits:{
          fileSize: 1024 * 1024 * 10
      }
      });
      const qa=uploadQa.array('pics',10);

      const uploadVd=multer({storage:storage,
        fileFilter: function (req, file, callback) {
          var ext = file.mimetype;
          if(ext !== 'video/mp4') {
              return callback(new Error('Only mp4 are allowed'))
          }
          callback(null, true)
      },
      limits:{
          fileSize: 1024 * 1024 * 500
      }
      });

      const vd =uploadVd.single('video');

      app.get('/register',async function(req,res){
        res.render('signup');
      })
    app.post('/register',dp, authController().postRegister)

    app.post('/logout', authController().logout);

    app.get('/jobs',employerController().getJobs)

    app.post('/jobsParti',auth,employerController().getJobsPart)

    app.post('/jobs',auth,employer,employerController().postJobs)

    app.post('/applyJobs',auth,notEmployer,employerController().applyJob)

    app.post('/editJob',auth,employerController().editJobRequest);

    app.post('/editJobForm',auth,employerController().editJob)

    app.get('/viewJob/:id',auth,employerController().viewJob);

    app.get('/editUser',auth,async function(req,res){
       res.render('editUser',{
         user : req.user
       })
    })

    app.post('/editUser',auth,dp,employerController().editUser)

    app.post('/deleteUser',auth,employerController().deleteUser)

    app.get('/adminJobs',admin,adminController().getAdminJobs)

    app.post('/adminJobs',admin,adminController().postAdminJobs)

    app.get('/adminArticles',admin,adminController().getAdminArticle)

    app.post('/adminArticles',admin,adminController().postAdminArticle)

    app.get('/adminVideos',admin,adminController().getAdminVideos)

    app.post('/adminVideos',admin,adminController().postAdminVideos)


    app.get('/articles',articleController().getArticle)

    app.post('/article',auth,articleController().postArticle)
    app.get('/article/:id',auth,articleController().individualArticle)

    app.post('/likeArticle',auth,articleController().likeArticle)

    app.get('/likedUsers/:articleId',auth,articleController().likedUsers)

    app.post('/getComment',auth,articleController().getComment)

    app.post('/postComment',auth,articleController().postComment)

    app.post('/likeComment',auth,articleController().likeComment)

    app.post('/getReply',auth,articleController().getReply)

    app.post('/postReply',auth,articleController().postReply)

    app.post('/editArticle',auth,async function(req,res){
       let id = req.body.id;
       let article = await Article.findById(id);
        res.render('editArticle',{
            article : article
        })
    })

    app.get('/viewArticle/:id',auth,articleController().viewArticle)

    app.post('/editArticleForm',auth,articleController().editArticle)

   // app.post('/likeReply',auth,articleController().likeReply)

    app.get('/getcourse',courseAuthorController().getCourse)

    app.post('/postCourse',auth,notStudent,courseAuthorController().postCourse)

    app.post('/getLessons',auth,courseAuthorController().getLessons)

    app.post('/postLessons',auth,notStudent,courseAuthorController().postLessons)

    app.post('/postVideo',auth,notStudent,vd,courseAuthorController().postVideo)

    app.get('/getVideo/:id',auth,courseAuthorController().getVideo)

    app.get('/viewCourse/:id',auth,courseAuthorController().viewCourse)

    app.post('/getVideoEJS',auth,registered,async function(req,res){
        res.render('viewVideo',{
          id : req.body.id
        });
    })

    app.post('/registerForCourse',auth,student,courseAuthorController().registerForCourse)

    app.get('/getQuestion',discussionController().getQuestion)

    app.post('/postQuestion',auth,qa,discussionController().postQuestion)

    app.post('/getSpecificQuestion',discussionController().getPartiQuestion)

    app.get('/question/:id',discussionController().getPartialQuestion)

    app.post('/getAnswer',discussionController().getAnswer)

    app.post('/postAnswer',auth,qa,discussionController().postAnswer)

    app.post('/likeQuestion',auth,discussionController().likeQuestion)

    app.post('/likeAnswer',auth,discussionController().likeAnswer)

    app.post('/postAnswerReply',auth,discussionController().postReply)

    app.post('/viewProfile',auth,employerController().viewUser)

    //changed code by me
    app.get("/viewAddArticle",auth,(req,res)=>{
      res.render("addArticle");
    });
    app.get("/viewAddJob",auth,(req,res)=>{
      res.render("addJob");
    });
    app.get("/viewAddCourse",auth,(req,res)=>{
      res.render("addCourse");
    })
    app.get("/viewAddLesson/:id",auth,(req,res)=>{
      res.render("addLesson",{id:req.params.id});
    })

    app.get("/viewAddVideo/:id",auth,(req,res)=>{
      res.render("addVideo",{id:req.params.id});
    })
    app.get("/viewAddQuestion",auth,(req,res)=>{
      res.render("addQuestion");
    });


}
module.exports = initRoute;
