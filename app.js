var express = require('express'); 
var app = express(); 
var cookieParser = require('cookie-parser');
var session = require('express-session');
const fs = require("fs");


app.use(express.static(__dirname + '/views'));
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.use(require('body-parser'). urlencoded({ extended: true }));
app.set('port', process.env.PORT | 3000);

app.get('/', function (req, res) {
  res.sendFile('index.html')
});



app.post('/checkout', function (req,res){
    console.log(' Form (from querystring): ' + req.query.form);
    console.log(' turtles: ' + req.body.turtles); 
    console.log(' milk: ' + req.body.milk);
    console.log(' pepper: ' + req.body.peppermint);
    console.log(' espresso: ' + req.body.espresso);
    console.log(' toffee: ' + req.body.toffee); 

    req.session.cart = [req.body.turtles, req.body.milk,req.body.peppermint, req.body.espresso,req.body.toffee];
    console.log(req.session.cart);

    res.sendFile(__dirname + '/views/checkout.html');

});


app.post('/edit', function (req,res){

    //res.sendFile(__dirname + '/views/index.html');
    res.send(req.session.cart);
});

fs.readFile(require.resolve('./inventory.json'), "utf-8", (err, data) => {
    if (err) {
        throw err;
    }
    var inventory = JSON.parse(data);
    console.log(inventory);
});



app.listen(app.get('port'),function(){
    console.log(`Server is listening on port 3000`);
  });

  