const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')
//middleware
const getbook = async(req,res,next)=>{
    let book;
    const {id} = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json(
           {
            message: 'ID no valido'
           }
        )
    }
    try {
        book = await Book.findById(id);
        if(!book){
            return res.status(404).json(
                {
                    message: 'libro no encontrado'
                }
            )
        }
    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }
    res.book = book;
    next()
}
//obtener todos los datos
router.get('/', async (req,res)=>{
    try {
        const books = await Book.find();
        console.log('get all', books);
        if(books.length===0){
            return res.status(204).json([])
        }
        res.json(books)
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//busca un libro por id
router.get('/:id', getbook, async (req, res) => {
    res.json(res.book);
})

//modifica los datos de un libro
router.put('/:id', getbook, async (req, res) => {
   try {
    const book = res.book
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save()
    res.json(updatedBook)

   } catch (error) {
        res.status(400).json({
            message: error.message
        })
   }
})

//metodo patch
router.patch('/:id', getbook, async (req, res) => {

    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
        res.status(400).json({
            message: 'por lo menos uno de estos campos debe ser enviados : titulo, autor, genero, fecha de publicacion'
        })
    }
    try {
     const book = res.book
     book.title = req.body.title || book.title;
     book.author = req.body.author || book.author;
     book.genre = req.body.genre || book.genre;
     book.publication_date = req.body.publication_date || book.publication_date;
 
     const updatedBook = await book.save()
     res.json(updatedBook)
 
    } catch (error) {
         res.status(400).json({
             message: error.message
         })
    }
 })
//agrega un nuevo libro
router.post('/', async (req, res) =>{
    const{title, author, genre, publication_date} = req?.body
    if(!title || !author || !genre || !publication_date){
        return res.status(400).json({
            message: 'todos los campos son obligatorios'
        })
    }
    const book = new Book(
        {
            title, 
            author, 
            genre, 
            publication_date
        }
    )
    try {
        const newBook = await book.save()
        console.log(newBook);
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})
//delete
router.delete('/:id', getbook, async (req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        })
        res.json({
            message: `el libro ${book.title} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})
module.exports = router