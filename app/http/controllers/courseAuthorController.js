const Course = require('../../model/course');
const Lesson = require('../../model/lesson');
const Video =  require('../../model/video');
const User =  require('../../model/user');

const fs = require('fs')
const path = require('path')

function courseAuthorController(){

    return {
        async getCourse(req,res){
            try {
                let courses = await Course.find({}).populate('author');
               /* return res.status(200).json({
                    message: 'Success',
                    coursess : courses
                });*/
                res.render("allCourse.ejs",{
                    courses : courses
                });

            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        },
        async postCourse(req,res){
            let title = req.body.title; let info = req.body.info;
            if(title == "" || info == "" || title == null || info == null){
                return res.status(500).json({
                    message: 'no filds can be empty'
                });
            }
            else{
            try {
                const newCourse = new Course({
                    title : title,
                    info : info,
                    author : req.user._id
                });
                await newCourse.save();

                User.findById(req.user._id,async function(err,doc){
                    if(err){
                        return res.status(500).json({
                            message: err
                        });
                    }
                    doc.courses.push(newCourse._id);
                    doc.save();
                    res.redirect('/getcourse');
                  })
               /* return res.status(200).json({
                    message: 'Success',
                    course : newCourse
                });*/

            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        }
        },
        async viewCourse(req,res){
            let id = req.params.id;
            try {
                let course = await Course.findById(id).populate("lessons").populate("author").populate("registered");
                let author = false;
                if(req.user._id.equals(course.author._id))
                author = true;

                res.render('viewCourse',{
                    course : course,
                    author : author
                })
            } catch (error) {
                return res.status(500).json({
                    message: error.message
                });
            }
        },
        async getLessons(req,res){
            let courseId = req.body.id;
            console.log(req.body.id);
            if(courseId == "" || courseId == null ){
                return res.status(500).json({
                    message: 'no filds can be empty'
                });
            }
            else{
            try {
                let lessons = await Lesson.find({course : courseId}).populate('videos');
               /* return res.status(200).json({
                    message: 'Success',
                    lessons : lessons
                });*/
                res.render('allLessons',{
                    lessons : lessons,
                    id : courseId
                })
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        }
        },
        async postLessons(req,res){
            let courseId = req.body.id;let title = req.body.title;
            if(courseId == "" || title == "" || courseId == null || title == null){
                return res.status(500).json({
                    message: 'no filds can be empty'
                });
            }
            else{
            try {
                const newLesson = new Lesson({
                    title : title,
                    course : courseId
                });
                await newLesson.save();

                Course.findById(courseId,async function(err,doc){
                    if(err){
                        return res.status(500).json({
                            message: 'Inrenal server error'
                        });
                    }
                    else{
                        await doc.lessons.push(newLesson._id);
                        await doc.save();
                       /* return res.status(200).json({
                            message: 'Success',
                            course : doc
                        });*/
                        res.redirect('/getcourse');
                    }
                })
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        }
        },
        async postVideo(req,res){
            let {title,content,id} = req.body;
            if(title == "" || content == "" || id == "" || title == null || content == null || id == null){
                return res.status(500).json({
                    message: 'No fields can be empty'
                });
            }
            else if(req.file){
                try {
                    const newvideo = new Video({
                        title : title,
                        content : content,
                        lesson : id,
                        path : req.file.path
                    });
                    await newvideo.save();
                    Lesson.findById(id,async function(err,doc){
                        if(err){
                            return res.status(500).json({
                                message: 'Inrenal server error'
                            });
                        }
                        else{
                            await doc.videos.push(newvideo._id);
                            await doc.save();
                            return res.status(200).redirect("/getcourse");
                        }
                    })
                } catch (error) {
                    return res.status(500).json({
                        message: 'Inrenal server error'+error+'.'
                    });
                }

            }
            else{
                return res.status(500).json({
                    message: 'Please upload the video'
                });
            }
        },
        async getVideo(req,res){
            let id = req.params.id;
            if(id == "" || id == null){
                return res.status(500).json({
                    message: 'No fields can be empty'
                });
            }
            else{
        Video.findById(id,async function(err,doc){
            if(err){
                return res.status(500).json({
                    message: err
                });
            }
            else{

                const path = doc.path
                const stat = fs.statSync(path)
                const fileSize = stat.size
                const range = req.headers.range

                if (range) {
                  const parts = range.replace(/bytes=/, "").split("-")
                  const start = parseInt(parts[0], 10)
                  const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize-1

                  if(start >= fileSize) {
                    res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
                    return
                  }

                  const chunksize = (end-start)+1
                  const file = fs.createReadStream(path, {start, end})
                  const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                  }

                  res.writeHead(206, head)
                  file.pipe(res)
                  //console.log(chunksize);
                } else {
                  const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                  }
                  res.writeHead(200, head)
                  fs.createReadStream(path).pipe(res)
                }
             }
            });
        }
        },
        async registerForCourse(req,res){
            let id = req.body.id;
            if(id == "" || id == null){
                return res.status(500).json({
                    message: 'No filds can be empty'
                });
            }
            else{
                Course.findById(id,async function(err,doc){
                    if(err){
                        return res.status(500).json({
                            message: 'Intrnal servor error'
                        });
                    }
                    else if(doc.registered.indexOf(req.user._id) === -1){
                        await doc.registered.push(req.user._id);
                        await doc.save();
                        /*return res.status(200).json({
                            message: 'Success',
                            course : doc
                        });*/
                        User.findById(req.user._id,async function(err,docc){
                            if(err){
                                return res.status(500).json({
                                    message: 'Intrnal servor error'
                                });
                            }
                            else{
                                docc.courses.push(id);
                                await docc.save();

                            }
                        })

                    }
                    res.redirect('/getcourse');
                })
            }
        }
    }
}
module.exports = courseAuthorController;
