const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const validator = require("email-validator");
const _ = require('lodash');

const {
    AuthMiddleware
} = require("./auth.middleware");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cleveroad'
});

const SECRET = "cleveroad"

router.get('/me', AuthMiddleware, (req, res) => {
    pool.getConnection((err, connection) => {
        connection.query(
            `SELECT user_id, phone, email FROM users WHERE email="${req.user.email}"`,
            (er, rows) => {
                if (er) {
                    throw er;
                } else {
                    return res.send({
                        id: rows[0].user_id,
                        phone: rows[0].phone,
                        email: rows[0].email
                    })
                }
            });

        connection.release();
    });

})

router.get('/items', (req, res) => {
    pool.getConnection((err, connection) => {
        connection.query(
            `SELECT items.user_id,items.id, items.date, items.title, items.price,items.image, users.user_id, users.phone, users.email,users.name FROM items, users WHERE items.user_id = users.user_id`,
            (er, rows) => {
                if (er) {
                    throw er;
                } else {

                    let data = []
                    _.forEach(rows, (value) => {
                        const dat = [{
                            id: value.id,
                            created_at: value.date,
                            title: value.title,
                            price: value.price,
                            image: value.image,
                            user_id: value.user_id,
                            user: {
                                id: value.user_id,
                                phone: value.phone,
                                name: value.name,
                                email: value.email
                            }
                        }]
                        data = _.concat(data, dat);


                    });
                    return res.send(
                        data
                    )

                }


            });

        connection.release();

    });

})
router.get('/items/:id', (req, res) => {
    const {
        id
    } = req.params
    pool.getConnection((err, connection) => {

        connection.query(
            `SELECT items.user_id,items.id, items.date, items.title, items.price,items.image, users.user_id, users.phone, users.email,users.name FROM items, users WHERE items.user_id = users.user_id AND items.id = "${id}"`,
            (er, rows) => {
                if (er) {
                    throw er;
                } else {
                    if (rows[0]) {
                        let data = []
                        _.forEach(rows, (value) => {
                            const dat = [{
                                id: value.id,
                                created_at: value.date,
                                title: value.title,
                                price: value.price,
                                image: value.image,
                                user_id: value.user_id,
                                user: {
                                    id: value.user_id,
                                    phone: value.phone,
                                    name: value.name,
                                    email: value.email
                                }
                            }]
                            data = _.concat(data, dat);

                        });
                        return res.send(
                            data
                        )
                    } else {
                        return res.status(404).send({
                                error: "Not found"
                            }

                        )
                    }

                }
            });
        connection.release();
    });
})

router.get("/verify", async (req, res) => {
    const headers = req.headers.authorization;
    const token = headers.replace("Bearer ", "");

    if (token == "") {
        return res.send({
            message: "not auth"
        });
    }
    try {
        const obj = jwt.verify(token, SECRET);
        return res.send({
            status: "ok",
            payload: {
                ...obj
            }
        });
    } catch (err) {
        return res.send({
            message: "bad token"
        });
    }

    return res.send({
        message: "ok",
        ...obj
    });
});
router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    pool.getConnection((err, connection) => {
        connection.query(
            `SELECT user_id,email,password FROM users WHERE email="${email}"`,
            (er, rows) => {
                if (er) throw er;
                else {
                    if (!rows[0]) {
                        return res.status(422).send({
                            "field": "password",
                            "message": "Wrong email or password"
                        });
                    } else {
                        if (rows[0].password === password) {
                            const token = jwt.sign({
                                    email: rows[0].email,
                                    id: rows[0].user_id
                                },
                                SECRET, {
                                    expiresIn: "24h"
                                }
                            );
                            return res.status(200).send({
                                token: "Bearer " + token
                            });
                        } else {
                            return res.status(422).send({
                                "field": "password",
                                "message": "Wrong email or password"
                            });
                        }
                    }
                }
            });

        connection.release();
    });
})
router.post('/register', (req, res) => {
    const {
        phone,
        name,
        email,
        password
    } = req.body
    const emailverify = validator.validate(email)
    if (emailverify && password != "" && name != "") {
        pool.getConnection((err, connect) => {
            connect.query(`SELECT user_id ,email FROM users WHERE email="${email}"`, (er, result) => {
                if (er) {
                    throw er;
                } else {
                    if (!result[0]) {
                        connect.query(`INSERT INTO users(phone, name, email, password) VALUES ("${phone}","${name}","${email}","${password}")`, (error, rows) => {
                            if (error) throw error;
                            else {
                                connect.query(`SELECT user_id ,email FROM users WHERE email="${email}"`, (e, r) => {
                                    const token = jwt.sign({
                                            email: email,
                                            id: r[0].user_id
                                        },
                                        SECRET, {
                                            expiresIn: "24h"
                                        }
                                    );
                                    return res.send({
                                        token: token
                                    })
                                })

                            }
                        })
                    } else {
                        return res.status(401).send({
                            "message": "mail was previously registered"
                        })
                    }
                }
            })
            connect.release();
        })
    } else {
        res.status(422).send({
            "field": "current_password",
            "message": "Wrong current password"
        }, )
    }


})
router.post('/items', AuthMiddleware, (req, res) => {
    const {
        title,
        price
    } = req.body

    if (title != "") {
        if (price != "") {
            const file = req.files.file
            const filename = file.name
            pool.getConnection((err, connection) => {
                connection.query(
                    `SELECT user_id, phone, name, email FROM users WHERE email="${req.user.email}"`,
                    (er, rows) => {
                        if (er) {
                            throw er;
                        } else {
                            connection.query(`INSERT INTO 
                                    items (
                                    title , 
                                    price , 
                                    image , 
                                    user_id , 
                                    date) VALUES("${title}", "${price}", "/uploads/${filename}", "${rows[0].user_id}", "${timestamp()}")
                                    `, (error, result) => {
                                if (result) {
                                    file.mv("./uploads/" + filename, err => {
                                        if (err) {
                                            return res.status(422)
                                        } else {
                                            connection.query(
                                                `SELECT items.user_id,items.id, items.date, items.title, items.price,items.image, users.user_id, users.phone, users.email,users.name FROM items, users WHERE items.user_id = users.user_id AND items.id = "${result.insertId}" `,
                                                (er, rows) => {
                                                    if (er) {
                                                        throw er;
                                                    } else {
                                                        if (rows[0]) {
                                                            let data = []
                                                            _.forEach(rows, (value) => {
                                                                const dat = [{
                                                                    id: value.id,
                                                                    created_at: value.date,
                                                                    title: value.title,
                                                                    price: value.price,
                                                                    image: value.image,
                                                                    user_id: value.user_id,
                                                                    user: {
                                                                        id: value.user_id,
                                                                        phone: value.phone,
                                                                        name: value.name,
                                                                        email: value.email
                                                                    }
                                                                }]
                                                                data = _.concat(data, dat);

                                                            });
                                                            return res.send(
                                                                data
                                                            )
                                                        } else {
                                                            return res.status(404).send({
                                                                    error: "Not found"
                                                                }

                                                            )
                                                        }

                                                    }
                                                });
                                        }
                                    })
                                }

                            })
                        }
                    });

                connection.release();
            });
        } else {
            return res.status(422).send({
                "field": "price",
                "message": "Price is required"
            })
        }
    } else {
        return res.status(422).send({
            "field": "title",
            "message": "Title is required"
        })
    }
})
router.put('/items/:id/images', AuthMiddleware, (req, res) => {
    const file = req.files.file
    const filename = file.name
    if (file.size < 100000) {
        if (req.params.id) {
            if (file.mimetype === "image/jpeg") {
                pool.getConnection((err, connect) => {
                    connect.query(`SELECT id FROM items WHERE id="${req.params.id}" AND user_id="${req.user.id}"`, (err, result) => {

                        if (result[0].id != "") {
                            file.mv("./uploads/" + filename, err => {
                                if (err) {

                                } else {

                                }


                            })
                            connect.query(`UPDATE items  SET image = "./uploads/${filename}" WHERE id = "${result[0].id}"`, (e, r) => {
                                if (r) {
                                    connect.query(
                                        `SELECT items.user_id,items.id, items.date, items.title, items.price,items.image, users.user_id, users.phone, users.email,users.name FROM items, users WHERE items.user_id = users.user_id AND items.id = "${req.params.id}"`,
                                        (er, rows) => {
                                            if (er) {
                                                throw er;
                                            } else {
                                                let data = []
                                                _.forEach(rows, (value) => {
                                                    const dat = [{
                                                        id: value.id,
                                                        created_at: value.date,
                                                        title: value.title,
                                                        price: value.price,
                                                        image: value.image,
                                                        user_id: value.user_id,
                                                        user: {
                                                            id: value.user_id,
                                                            phone: value.phone,
                                                            name: value.name,
                                                            email: value.email
                                                        }
                                                    }]
                                                    data = _.concat(data, dat);


                                                });
                                                return res.send(
                                                    data
                                                )

                                            }


                                        });

                                }
                            })
                        } else {
                            return res.status(404).send()
                        }
                    })
                })

            } else {
                return res.status(422).send({
                    field: "image",
                    error: "type file is bad"
                })
            }
        } else {
            return res.statusCode(404).send()
        }
    } else {
        return res.status(422).send({
            field: "image",
            error: "The file 100 b is too big."
        })
    }

})




router.put('/items/:id', AuthMiddleware, (req, res) => {
    const {
        title,
        price
    } = req.body;


    pool.getConnection((err, connection) => {
        connection.query(
            `SELECT id FROM items WHERE id="${req.params.id}" OR user_id="${req.user.id}"`,
            (er, rows) => {
                if (er) {
                    throw er;
                } else {
                    if (title) {
                        connection.query(`UPDATE items SET title = "${title}" WHERE id = "${req.params.id}"`, (errq, respons) => {

                        })
                    }
                    if (price) {
                        connection.query(`UPDATE items SET price = "${price}" WHERE id = "${req.params.id}"`, (errq, respon) => {

                        })
                    }
                    if (title != "" && price != "") {
                        connection.query(`UPDATE items SET price = "${price}", title = "${title}" WHERE id = "${req.params.id}"`, (errq, respon) => {

                        })
                    }
                    connection.query(
                        `SELECT items.user_id,items.id, items.date, items.title, items.price,items.image, users.user_id, users.phone, users.email,users.name FROM items, users WHERE items.user_id = users.user_id AND items.id = "${req.params.id}"`,
                        (er, rowsr) => {
                            if (er) {
                                throw er;
                            } else {
                                let data = []
                                _.forEach(rowsr, (value) => {
                                    const dat = [{
                                        id: value.id,
                                        created_at: value.date,
                                        title: value.title,
                                        price: value.price,
                                        image: value.image,
                                        user_id: value.user_id,
                                        user: {
                                            id: value.user_id,
                                            phone: value.phone,
                                            name: value.name,
                                            email: value.email
                                        }
                                    }]
                                    data = _.concat(data, dat);


                                });
                                return res.send(
                                    data
                                )

                            }


                        });
                }
            });

        connection.release();
    });

})

router.delete('/items/:id', AuthMiddleware, (req, res) => {
    const {
        id
    } = req.params;
    pool.getConnection((err, connect) => {
        connect.query(`SELECT id,user_id FROM items WHERE id = "${id}" AND user_id="${req.user.id}"
`, (er, result) => {
            if (er) {
                throw er;
            } else {
                if (result[0]) {
                    connect.query(`DELETE FROM items WHERE id = "${id}"`, (error, rows) => {
                        if (error) throw error;
                        if (rows) {
                            return res.status(200).send()
                        }

                    })
                } else {
                    return res.status(404).send()
                }
            }

        })
        connect.release();

    })

})



module.exports = router