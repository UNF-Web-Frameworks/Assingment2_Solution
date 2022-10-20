/*
    Assignment 2 Solution by Prof. Jose C Gomez Fall 2022
*/


import express from 'express';
import swaggerUI from 'swagger-ui-express';
import { User } from './models/users';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

let app = express();
app.use(cors({credentials: true, origin: true}));

let userArray: User[] = [];
let swagger_doc = fs.readFileSync(path.join(process.cwd(),'src','openapi.json'));
let swagger_obj = JSON.parse(swagger_doc.toString());

// Parse body with app
app.use(express.json());

/*
    Creates a new user from the body, expects a json object in the following format:
    {
        "userId":"userId1",
        "firstName":"Jose",
        "lastName":"Gomez",
        "emailAddress":"jose@josecgomez.com",
        "password":"pwd"
    }
    All properties are required.
*/
app.post('/Users', (req,res,next)=>{
    if(userArray.find(user => user.userId == req.body.userId))
    {
        res.status(409).send({message:'UserId already in use',status:409});
    }
    else
    {
        let sentUser = new User();
        Object.assign(sentUser, req.body);
        if(sentUser.CompleteUser())
        {
            userArray.push(sentUser);
            res.status(201).send(sentUser.GetPasswordlessUser());
        }
        else
        {
            res.status(406).send({message:'All properties are required for a new user userId,firstName,lastName,emailAddress, password',status:406});
        }
    }
});

//Returns userArray and status 200
app.get("/Users",(req,res,next)=>{
    res.status(200).send(userArray.map(user=>user.GetPasswordlessUser()));
});

//Returns the user record requested by the parameter userId and status 200
app.get("/Users/:userId",(req,res,next)=>{
    let user = userArray.find(user => user.userId == req.params.userId);
    if(user)
    {
        res.status(200).send(user.GetPasswordlessUser());
    }
    else
    {
        res.status(404).send({message:'User not found',status:404});
    }
});

app.patch("/Users/:userId",(req,res,next)=>{
    let user = userArray.find(user => user.userId == req.params.userId);
    if(user)
    {
        delete req.body.userId;
        
        Object.keys(user).forEach(function(key) {
            if(req.body.hasOwnProperty(key))
            { 
                    (user as any)[key] = req.body[key];
            }
        });
        res.status(200).send(user.GetPasswordlessUser());
    }
    else
    {
        res.status(404).send({message:'User not found',status:404});
    }
});

// Deletes a give a user
app.delete("/Users/:userId",(req,res,next)=>{
    let user = userArray.find(user => user.userId == req.params.userId);
    if(user)
    {
        userArray.splice(userArray.indexOf(user),1);
        res.status(204).send({message:'User deleted',status:204});
    }
    else
    {
        res.status(404).send({message:'User not found',status:404});
    }
});

app.use('/', swaggerUI.serve, swaggerUI.setup(swagger_obj));

app.listen(3000);