const User = require('../../model/user');
const Job = require('../../model/job');
const bcrypt = require('bcryptjs');
const authController = require('./authController');
function employerController(){

    return {

        async getJobs(req,res){
            try {
                let jobs = await Job.find({approved : 1}).populate("employer");
               /* return res.status(200).json({
                    message: 'Success',
                    jobs : jobs
                });*/
                res.render('showJobs',{
                    jobs : jobs
                });
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        },
        async getJobsPart(req,res){
            try {
                let jobs = await User.findById(req.user._id,{jobs:1}).populate("jobs");
               /* return res.status(200).json({
                    message: 'Success',
                    jobs : jobs
                });*/
                res.render('showJobs',{
                    jobs : jobs.jobs
                });
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        },
        async postJobs(req,res){
            try {
                let title = req.body.title;let info = req.body.info;
                if(!title || !info || title == "" || info == ""){
                return res.status(500).json({
                    message: 'No fields can be empty'
                });
                }
                const newjob = new Job({
                    title : title,
                    info : info,
                    employer : req.user._id,
                });
                await newjob.save();
                User.findById(req.user._id,async function(err,doc){
                    if(err){
                        return res.status(500).json({
                            message: 'Internal server error'
                        });
                    }
                    doc.jobs.push(newjob._id);
                    doc.save();
                   /* return res.status(200).json({
                        message: 'Success',
                        employer : doc
                    });*/
                    res.redirect('/jobs');
                });

            } catch (error) {
                return res.status(500).json({
                    message: error
                });
            }
        },
        async viewJob(req,res){
            let id = req.params.id;
            try {
                let job = await Job.findById(id).populate("applied");
                let employer = false;
                if(req.user.type === 1)
                employer = true;

                res.render('viewJob',{
                    job : job,
                    employer : employer
                })
            } catch (error) {
                return res.status(500).json({
                    message: error.message
                });
            }
        },
        async editUser(req,res){
            let {name,info,password,passd} = req.body;

            if(name == "" || info == ""  || passd == "" || name == null || info == null  || passd == null){
                return res.status(500).json({
                    message: 'No fields can be empty'
                });
            }
            bcrypt.compare(passd, req.user.password).then(async (match)=>{
                if(!match){
                    return res.status(500).json({
                        message: 'Please enter the correct old password'
                    });
                }
                else{

                    try {
                     const hashedPass = await bcrypt.hash(password, 10);
                     const filter = { _id : req.user._id };
                     const upd = { name : name,
                                 info : info
                          };
                          if(password){
                            upd.password = hashedPass;
                          }
                          if(req.file){
                             upd.profileImage=req.file.path;
                         }
                         console.log(upd);
                     const update = { $set: {
                         ...upd
                     }};
                         console.log(update);

                     let doc = await User.findOneAndUpdate(filter, update, {
                                      new: true
                                 });
                                /* return res.status(200).json({
                                     message: 'Success',
                                     user : doc
                                 });*/
                                 req.user = await doc;
                                 res.redirect('..');

                     } catch (error) {
                         return res.status(500).json({
                             message: error.message
                         });
                     }
                }

            }).catch((err)=>{
                return res.status(500).json({
                    message: err.message
                });
            })

        },
        async deleteUser(req,res){
            try {
                let jobs = await User.findById(req.user._id,{jobs : 1});
                for(let i=0;i<jobs.jobs.length;i++){
                    Job.deleteMany({_id:jobs.jobs[i]},function(err){
                        if(err){
                            res.send(err);
                        }
                    })
                }

                User.deleteOne({_id:req.user._id},function(err){
                    if(err)
                     res.send(err);
                     else{
                        authController().logout;
                        res.status(200).json({
                           message: 'Success'
                       });
                     }
                });

            } catch (error) {
                return res.status(500).json({
                    message: error
                });
            }
        },
        async applyJob(req,res){
            let jId = req.body.id;
            try {
                Job.findById(jId,async function(err,doc){
                    if(doc.applied.indexOf(req.user._id) === -1){
                        await doc.applied.push(req.user._id);
                        await doc.save();
                        User.findById(req.user._id,async function(err,docc){
                            if(err){
                                return res.status(500).json({
                                    message: 'Intrnal servor error'
                                });
                            }
                            else{
                                docc.jobs.push(jId);
                            await docc.save();
                            res.redirect('/jobs');
                            }

                })

                      }

                /*return res.status(200).json({
                    message: 'Success',
                    job : doc
                });*/
            })
            } catch (error) {
                return res.status(500).json({
                    message: error.message
                });
            }
        },
        async viewApplied(req,res){
            let jId = req.body.id;
            try {
                let applied = await Job.findById(jId,{applied:1}).populate('applied');

                /*return res.status(200).json({
                    message: 'Success',
                    job : doc
                });*/
                res.render('viewUsers',{
                    users : applied.applied
                })

            } catch (error) {
                return res.status(500).json({
                    message: error.message
                });
            }
        },
        async viewUser(req,res){
            let id = req.body.id;
            if(!id){
                id = req.user._id;
            }
            try {
                let user = await User.findById(id).populate('jobs').populate('articles').populate('courses');
                res.render('showProfile',{
                    user : user,
                    logged : req.user
                });
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        },
        async editJob(req,res){
                  let id = req.body.id;
                  let info = req.body.info;
                  let title = req.body.title;
                  if(info == "" || title == "" || info == null || title == null){
                      console.log(req.body);

                      return res.status(500).json({
                          message: 'No fields can be empty'
                      });
                  }
                  else{
                      try {

                          const filter = { _id : id};
                      const upd = { title : title,
                                  info : info,
                                  approved : 0
                           };
                      const update = { $set: {
                          ...upd
                      }};
                              let job = await Job.findOneAndUpdate(filter, update, {
                                           new: true
                              });
                       res.redirect('..');
                      } catch (error) {
                          return res.status(500).json({
                              message: error.message
                          });
                      }
                  }
              },
              async editJobRequest(req,res){
                  let id = req.body.id;
                  try {
                      let job = await Job.findById(id);
                      res.render('editJob.ejs',{
                          job :job
                      })
                  } catch (error) {
                      return res.status(500).json({
                          message: error.message
                      });
                  }
              }


    }
}
module.exports = employerController;
