const express=require('express');
const app=express();
const PORT =3000;
app.use(express.json())
const connectDB = require('./db');
connectDB();
const userRoute = require('./routes/userRoutes');

const logger = (req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next(); // move to next handler
};
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.use('/users', userRoute);
const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const auth=(req,res,next)=>{
    const token=req.headers['authorization'];
    if( token==='secret'){
        next();
    }
    else{
        res.status(401).send('unauthorized');
    }
}
app.use(logger); // apply middleware globally
app.get('/',(req,res)=>res.send('hello its express!'));


app.get('/hello',(req,res)=>res.send("hello world"));
app.post('/data',(req,res)=>{
    console.log(req.body);
    res.json({recieved : req.body});
})
app.put('/user/:id',(req,res)=>{
    const {id}=req.params;
    res.send(`user id ${id} updated`);
})
app.delete('/user/:id',(req,res)=>{
    const {id}=req.params;
    res.send(`user id ${id} deleted`);
})
app.get('/secure',auth,(req,res)=>{
    res.send("code accepted");
})

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));