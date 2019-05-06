
const express     = require('express')
const app         = express();
const port        =  process.env.PORT || 4000

//Route
const userRoutes = require('./router/user')
const PostRoutes = require('./router/post')


app.use(express.json())

app.use(userRoutes)
app.use(PostRoutes)


app.listen(port,() =>{
    console.log('server is up on ' + port);
})