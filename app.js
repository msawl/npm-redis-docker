// Initialize variables

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

const methodOverride = require('method-override');
const redis = require('redis');

//Set ports

const port = 3000;

// init app
const app = express()

//Create redis client
var client = redis.createClient()

client.on('connect' , function(){
    console.log('connected to redis')
})
//view engine 
app.engine('handlebars' , exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//methodOverride

app.use(methodOverride('_method'))

app.get('/' , function(req , res, next){
    res.render('searchusers');

});

//search page
app.post('/user/search' , function(req, res){
    let id = req.body.id ;
    client.hgetall(id, function(err, obj){
        if(!obj){
            res.render('searchusers', {
                error: 'User does not exist'
            });
        }else{
            obj.id = id;
            res.render('details', {
                user:obj
            });
        }
    });
});

app.get('/user/trial' , function(req, res){
    res.render('trial');
    console.log("trial")
});


app.listen(port , function(){
    console.log('Server started on port' + port)
})

app.get('/user/adduser', function(req, res){
    res.render('adduser')
})

app.post('/user/adduser', function(req, res){
    let id = req.body.id;
    var first = req.body.first
    client.hmset(id , ['first' , first], function(error , reply){
        if(error){
            console.log(error)
        }
        res.redirect('/')
    })
})