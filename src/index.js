
const express     = require('express')
const app         = express();
const port        =  process.env.PORT || 4000

app.listen(port,() =>{
    console.log('server is up on ' + port);
})