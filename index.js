//libraries
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mysql = require ('mysql')

//start express
const app = express()

//sql configurations
var pool = mysql.createPool ( {
  host: 'localhost',
  port: 3306,
  user: 'samuel',
  password: 'sam57940776',
  database: 'rsvp',
  connectionLimit: 4
})

//sql statements
const ADD_RSVP = 'INSERT INTO birthday (email, given_name, phone, attending, remarks) VALUES (?, ?, ?, ?, ?)'
const GET_RSVP = 'SELECT * FROM birthday'

//get list of rsvp
app.get('/list', (req, res) => {
  pool.getConnection( (err, conn) => {
    if (err) {
      console.error('DB Connection Error : ', err)
      return (resp.status(400).json({ error: err }))
    }
    conn.query(GET_RSVP, (err, result) => {
      if (err) {
        console.error('DB Query Error ', err)
        return (resp.status(400).json({ error: err }))
      }
      conn.release()
      console.info('List of RSVP Query Results', result)
      res.status(200).send(result)
    })
  })
})

//post new rsvp
app.post('/rsvp', bodyParser.json(), bodyParser.urlencoded({ extended: true }), (req, res) => {
  console.info('Body passed in ', req.body)
  pool.getConnection( (err, conn) => {
    if (err) {
      console.error('DB Connection Error : ', err)
      return (resp.status(400).json({ error: err }))
    }
    conn.query(ADD_RSVP, [req.body.email, req.body.given_name, req.body.phone, req.body.attending, req.body.remarks], (err, result) => {
      if (err) {
        console.error('DB Query Error ', err)
        return (resp.status(400).json({ error: err }))
      }
      conn.release()
      res.status(200).send('success!')
    })
  })
})

//static
app.use(express.static(path.join(__dirname, 'public')))

//ping database and start server
pool.getConnection( (err, conn) => {
  if (err) {
    console.error('DB Connection Error : ', err)
    process.exit(-1)
  } 
  conn.ping ((err) => { 
    if (err) {
      console.error('DB Ping Error ', err)
      process.exit(-1)
    }
    conn.release()
    const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000
    app.listen(PORT, () => {
      console.info (`Application started on port ${PORT} on ${new Date()}`)
    })
  })
})