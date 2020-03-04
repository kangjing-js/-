const express = require('express')
const app = express()
app.use(express.json())
app.use(require('cors')())
app.use('/uploads',express.static(__dirname + '/uploads'))
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/lkj-blog',
{ useNewUrlParser: true ,useUnifiedTopology: true})

const Blog = mongoose.model('Blog',new mongoose.Schema({
    title:{ 
        type:String},
    content:{
        type:String}
}))



app.get('/', (req, res) => res.send('Hello World!'))

//新建博客接口
app.post('/blog',async(req,res)=>{
    console.log(req.body);
    const result = await Blog.create(req.body);
    console.log(result);
    res.send(result)
})

//博客列表接口
app.get('/bloglist',async(req,res)=>{
    const result = await Blog.find();
    res.send(result)
})

//查询一条博客
app.get('/bloglist/:id',async(req,res)=>{
    const result = await Blog.findById(req.params.id);
    res.send(result)
})

//删除一条博客
app.delete('/blog/:id',async (req,res)=>{
    await Blog.findByIdAndDelete(req.params.id)
    res.send({
        success:true
    })
})
//修改一条博客
app.put('/blog/:id',async (req,res)=>{
    await Blog.findByIdAndUpdate(req.params.id,req.body)
    res.send({
        success:true
    })
})

//上传图片地址
const multer = require('multer')
console.log(__dirname);
const upload = multer({dest:__dirname + '/uploads'})
app.post('/blog/upload',upload.single('file'),async (req,res)=>{
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
})

app.listen(3000, () => console.log(`Example app listening on port 3000!`))