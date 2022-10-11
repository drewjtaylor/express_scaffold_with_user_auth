const express = require('express');
const userRouter = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const authenticate = require('../authenticate');
const User = require('../models/User');


userRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find()
    .then(users => {
        if (!users) {
            return
        };
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(users)
    })
    .catch(err => next(err))
})
.post((req, res, next) => {
    User.register(
        new User({username: req.body.username, email: req.body.email}),
        req.body.password,
        (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
                console.log('There was an error registering a new user');
                return next(err)
            } else {
                if (req.body.firstName) {
                    user.firstName = req.body.firstName
                };
                if (req.body.lastName) {
                    user.lastName = req.body.lastName
                };
                user.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return next(err)
                    };
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration successful'});
                    })
                })
            }
        }
    )
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /users')
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 200;
    res.end('Deleting all users');
});

// Route to log in
userRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'})
})

// Route searches for user by username
userRouter.get('/finduser/:username', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.findOne({username: req.params.username})
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err))
})

// Routes for dealing with single user
userRouter.route('/:userId')
.get(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
    User.findById(req.params.userId)
    .then(user => {
        console.log('user found');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err))
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /users/${req.params.userId}\nUsers must be adding by sending a POST request to /users`)
})
.put(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
    User.findByIdAndUpdate(req.params.userId, 
        {
            $set: req.body
        },
    {
        new: true
    })
    .then(user => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err))
})
.delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
    User.findByIdAndDelete(req.params.userId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
});

module.exports = userRouter;