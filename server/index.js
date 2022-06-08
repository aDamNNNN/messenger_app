const express = require('express');
const http = require('http');
const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const app = express();
const cors = require('cors')
const socketIO = require('socket.io')
const server = http.createServer(app);
//const io = new socketIO.Server(server).listen(server)
//const server = http.Server(app)
const io = require('socket.io')(server)
//const io = socketIO(server)
const { database } = require('./config/helpers');

const port = 3001

app.get("/", (req, res) => {
    res.send("Hello World!")
})

io.on("connection", socket => {
    //database.query('select * from `emberek`').then(result => {console.log(result)})
    socket.on("join-room", ( roomID, userID ) => {
        console.log("user joined room")
    })

    socket.on('signup', ({ email, password, userName }, callback) => {
        database.query("SELECT * FROM users where email=" + mysql.escape(email))
        .then(res => {
            const result = res
            const isEmpty = Object.keys(result).length === 0
            if (isEmpty) {
                callback("Succesfully registered, now login!")
                database.table('users').insert({
                    username: userName,
                    email: email,
                    password: password
                }).catch(err => alert("Unexpected error occured!"))
            } else { callback("Account with this email adress already exists!") }
        })
        
    })
    
    socket.on('login', ({ email, password }, callback) => {
        database.table('users').filter({
            email: email,
            password: password
        }).getAll().then(res => {
             if (Object.keys(res).length > 0) {
                callback(res[0].email)
             } else {callback(0)}
        })

        /* database.query("SELECT * FROM users where email=" + mysql.escape(email))
        .then(res => {
            const result = res
            try {
                if((result[0].email == email)) {
                    const cbemail = result[0].email
                    callback(cbemail)
                }
            } catch (error) {
                callback(0)
            }
            
        }) */
        
    })

    socket.on('createGroup', ({givenName, email}, callback) => {
        let group_ID
        let ID
        database.table('message_group').insert({group_name: givenName}).then(result => {
            group_ID = result.insertId
            database.table('users').filter({email: email}).get().then(result2 => {
                ID = result2.ID
                database.table('group_member').insert({ID: ID, group_ID: group_ID})
                callback("Group created!")
            })
        })
    })

    socket.on('returnGroups', ({email}, callback) => {
        let ID
        let group_ID = []
        
        database.table('users').filter({email: email}).get().then(result1 => {
            ID = result1.ID
            database.table('group_member').filter({ID: ID}).getAll().then(result2 => {
                result2.forEach(element => {
                    group_ID.push(element.group_ID)
                })
                database.table('message_group').filter({group_ID: {$in: group_ID}}).getAll().then(result3 => {
                    
                    callback(result3)
                })
            })
        })
    })

    socket.on('message_send', ({group_ID, message, email, createdAt}, callback) => {
        let ID
        database.table('users').filter({email: email}).get().then(result1 => {
            ID = result1.ID
            database.table('messages').insert({ID: ID, group_ID: group_ID, createdAt: createdAt, message: message, email: email})
        })
    })

    socket.on('readMessages', ({group_ID}, callback) => {
        database.table('messages').filter({group_ID: group_ID}).sort({createdAt: -1}).getAll().then(result1 => {
            callback(result1)
        })
    })

    socket.on('addNewMember', ({newemail, group_ID}, callback) => {
        database.table('users').filter({email: newemail}).getAll().then(result1 => {
            if (Object.keys(result1).length > 0) {
                const ID = result1[0].ID
                database.table('group_member').filter({ID: ID, group_ID: group_ID}).getAll().then(result2 => {
                    
                    if (Object.keys(result2).length > 0) {
                        callback("User already added!")
                    }
                    else {
                        database.table('group_member').insert({ID: ID, group_ID: group_ID})
                        callback("User added!")
                    }
                })
            } else { callback("User not found!") }
        })
    })
})

server.listen(port, ()=>{
    console.log("Listening to port: " + port)
})


