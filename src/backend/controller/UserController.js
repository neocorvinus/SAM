const express = require('express')
const user = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../model/User")
const Role = require("../model/Role")
const { Op } = require("sequelize");
const nodemailer = require('nodemailer');
const btoa = require('btoa');
const atob = require('atob');


process.env.SECRET_KEY = 'secret'

// REGISTER
user.post('/register', (req, res) => {
    const userData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        phone_number: req.body.phone_number,
        role_user_id: req.body.role_user_id,
        email: req.body.email
    }

    console.log(userData)

    userData.password_user = bcrypt.hashSync(userData.password, 12)
    User.create(userData).then(user => {
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, { expiresIn: 1440 })
        res.json({token: token})
    }).catch(err => {
        res.send(err)
        /*if (err.errors[0].path === "index_phone_number_unique") res.status(401).send("Le numéro de télephone est déjà lié un compte existant")
        else if (err.errors[0].path === "email_user_unique") res.status(401).send("L'adresse email est déjà lié un compte existant")
        else res.status(401).send("Une erreur est survenue dans la mise à jour du compte")*/
    })
})

// LOGIN
user.post('/login', (req, res) => {
    User.findOne({
        where: {
            [Op.or]: [
                { email: req.body.login_user },
                { phone_number: req.body.login_user }
            ]
        },
        include: [Role]
    }).then(user => {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                expiresIn: 1440
            })
            res.json({token: token})
        } else res.status(401).send("Le mot de passe est incorrect")
    }).catch(err => {
        res.send(err)
        //res.status(500).send("Aucun compte associé à cet idenfitiant")
    })
})

// PROFILE
user.get('/profile', (req, res) => {
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        where: {
            id_user: decoded.id_user
        },
        include: [Role]
    }).then(user => {
        if (user) res.send(user)
        else res.json({message: "Cet utilisateur est introuvable"})
    }).catch(err => {
        res.json({message: err})
    })
})

module.exports = user
