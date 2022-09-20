import * as express from 'express';
import Borrowed from '../models/borrowed';
import User from '../models/user';

export class UserController{
    allUsers= (req:express.Request,res:express.Response)=>{
        User.find({"type": {$ne:"admin"}},(err,users)=>{
            if(err) console.log(err);
            else  return res.json(users); 
        })
    }
     login = (req:express.Request,res:express.Response)=>{

         let username = req.body.username;
         let password= req.body.password;
         
         User.findOne({"username":username, "password":password}, (err,user)=>{
              if(err) console.log(err);
              else {

                if(user==null){
                    User.findOne({"username":username}, (err,user)=>{
                        if(err) console.log(err);
                        else if(user==null){
                            return res.json({message:"Incorrect username"});
                        }
                        else return res.json({message:"Incorrect password"});
                    });
                }else
                res.json(user);}
              
         });
         
     }
     addUser=(req:express.Request,res:express.Response)=>{
        let request = new User({
           username:req.body.username,
           password:req.body.password,
           firstname:req.body.firstname,
           lastname:req.body.lastname,
           address: req.body.address,
           phone: req.body.phone,
           email: req.body.email,
           image: req.body.image,
           type:req.body.type,
           status: "active",
        
       });

       request.save().then(user=>{
           res.status(200).json({message:"User succesfully added"});}
           ).catch(err=>{
               res.status(400).json({message:"error"})
           })
    }


    checkavailability=(req:express.Request,res:express.Response)=>{
       User.find({$or:[{"username":req.body.username},{"email":req.body.email}]},(err,user)=>{
            if(err) console.log(err);
            else if(user){
                 res.json(user);

            }
        });
        

    }
     register=(req:express.Request,res:express.Response)=>{
        let request = new User({
           username:req.body.username,
           password:req.body.password,
           firstname:req.body.firstname,
           lastname:req.body.lastname,
           address: req.body.address,
           phone: req.body.phone,
           email: req.body.email,
           image: req.body.image,
           type:req.body.type,
           status: "pending"
        
       });

       request.save().then(user=>{
           res.status(200).json({message:"Register request succesfully added"});}
           ).catch(err=>{
               res.status(400).json({message:"error"})
           })
    }

     acceptRequest=(req:express.Request,res:express.Response)=>{
        
        User.collection.updateOne({"username":req.body.username},{$set:{status:"active"}},(err,user)=>{
            if(err){
                console.log(err);
                
            }
            else  return res.json({message:"User succesfully added"});
        });
    }
    
    denyRequest=(req:express.Request,res:express.Response)=>{

        User.collection.deleteOne({username: req.body.username},(err)=>{
            if(err){
                console.log(err);
            }
            else  return res.json({message:"User succesfully deleted"});
        });
        
    }

    changePassword=(req:express.Request,res:express.Response)=>{
        User.collection.updateOne({"username":req.body.username},{$set:{password:req.body.newpassword}},(err,user)=>{
            if(err){
                console.log(err);
                
            }
            else  return res.json({message:"Password update successful"});
        });
        
    }
    // change to moderator/reader
    updateType=(req:express.Request,res:express.Response)=>{
        User.collection.updateOne({"username":req.body.username},{$set:{type:req.body.type}},(err,user)=>{
            if(err){
                console.log(err);
                
            }
            else  return res.json({message:"Type update successful"});
        });
        
    }
    block=(req:express.Request,res:express.Response)=>{
        User.collection.updateOne({"username":req.body.username},{$set:{status:"blocked"}},(err,user)=>{
            if(err){
                console.log(err);
                
            }
            else  return res.json({message:"User successfully blocked"});
        });
        
    }

    deblock=(req:express.Request,res:express.Response)=>{
        User.collection.updateOne({"username":req.body.username},{$set:{status:"active"}},(err,user)=>{
            if(err){
                console.log(err);
                
            }
            else  return res.json({message:"User successfully unblocked"});
        });
        
    }

    delete =(req:express.Request,res:express.Response)=>{
        Borrowed.collection.deleteMany({"username":req.body.username},(err)=>{
            if(err) console.log(err);
            else {
                User.collection.deleteOne({"username":req.body.username},(err)=>{
                    if(err) console.log(err);
                    else return res.json({message:"User succesfully deleted"});
                });
            }
        })
        
    }

    updateInfo= (req:express.Request,res:express.Response)=>{

        let username = req.body.username;
        let newusername = req.body.newusername;
        let password = req.body.password;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let address = req.body.address;
        let phone = req.body.phone;
        let email = req.body.email;
        let image = req.body.image;
      
        if(newusername!=null && username!=newusername){
            User.findOne({"username":newusername},(err,user)=>{
                if(err) console.log(err);
                else 
                if(user!=null){
                return res.json({message:"Username already taken"});
                }
                else {
                    User.collection.updateOne({"username":username},{$set:{username: newusername}},(err,user)=>{
                        if(err){
                            console.log(err);
                            
                        }else username = newusername;
                    });
                }
            });
        }
            
            if(email!=null){
                User.findOne({"email":email},(err,user)=>{
                    if(err) console.log(err);
                    else 
                    if(user!=null){
                    return res.json({message:"Email already taken"});
                    }
                    else {
                        User.collection.updateOne({"username":username},{$set:{email: email}},(err,user)=>{
                            if(err){
                                console.log(err);
                                
                            }
                        });
                    }
                });
            }
        

            if(password!=null){
                User.collection.updateOne({"username":username},{$set:{password: password}},(err,user)=>{
                    if(err){
                        console.log(err);
                        
                    }
                });
            }
            if(firstname!=null){
                User.collection.updateOne({"username":username},{$set:{firstname: firstname}},(err,user)=>{
                    if(err){
                        console.log(err);
                        
                    }
                });
            }
            if(lastname!=null){
                User.collection.updateOne({"username":username},{$set:{lastname: lastname}},(err,user)=>{
                    if(err){
                        console.log(err);
                        
                    }
                });
            }
            if(address!=null){
                User.collection.updateOne({"username":username},{$set:{address: address}},(err,user)=>{
                    if(err){
                        console.log(err);
                        
                    }
                });
            }

            if(phone!=null){
                User.collection.updateOne({"username":username},{$set:{phone: phone}},(err,user)=>{
                    if(err){
                        console.log(err);
                        
                    }
                });
            }

            if(image!=null){
                User.collection.updateOne({"username":username},{$set:{image: image}},(err,user)=>{
                    if(err){
                        console.log(err);
                        
                    }
                });
            }

        res.json();
        
    }
    uploadFile=(req:express.Request,res:express.Response)=>{
       // console.log("usao");
        //upload.single('file');
        res.json("good");
        //let file = req.body.file;

        /*let file = req['files'].photo;
        let username = req.body.username;
        console.log(file);
        console.log(file.name);*/
    }
    
    userInfo=(req:express.Request,res:express.Response)=>{

    let username = req.body.username;
       User.findOne({"username":username},(err,user)=>{
        if(err) console.log(err);
        else res.json(user);
       })
        
        
    }
    
}
