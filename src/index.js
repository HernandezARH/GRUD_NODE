const express = require('express')
const {config} = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
config()

const bookRoutes = require('./routes/book.routes')
//se usa express para los middleware
const app = express()
app.use(bodyParser.json())//parseador de bodies

//conectando a la base de datos
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;

app.use('/books', bookRoutes)
const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log(`servidor conrriendo en: ${port}`);
}
)