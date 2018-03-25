var express = require('express'); 
var app = express(); 
var cookieParser = require('cookie-parser');
var session = require('express-session');
const fs = require("fs");



//figure out how to organize these
app.use(express.static(__dirname + '/views'));
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.use(require('body-parser'). urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

//load inventory synchronously
var inventory = JSON.parse(fs.readFileSync('./inventory.json'));

//Render the home page
app.get('/', function (req, res) {
  res.render('index',{
      inventory: inventory
  });

});


//create shopping cart for user, check inventory, calculate totals, render checkout page
var prices = [];
var shipping = 0;
var cart = [];
app.post('/checkout', function (req,res){


    for(i = 0; i < inventory.length; i++){
        if( cart.length > 0 && cart[i] != null){
            cart[i] = cart[i] + Number(req.body["item"+i]);
        }else cart[i] = Number(req.body["item"+i]);
    }

    console.log(cart);
//calulate totals
var total_pieces = 0;
var subtotal = 0;
   for(i = 0; i < inventory.length; i++){
        prices[i] = inventory[i].price * Number(cart[i]);
        total_pieces = total_pieces + Number(cart[i]);
        subtotal = subtotal + prices[i];
        console.log("$",prices[i]);
    }
    console.log("$",subtotal);
    console.log(total_pieces);
    req.session.prices = prices;
    req.session.subtotal = subtotal;
    req.session.total_pieces = total_pieces;
    console.log(req.session.subtotal);
    console.log(req.session.total_pieces);

//calculate shipping
    if(total_pieces < 5){
        shipping = 5.00;
    }else if(total_pieces > 5 && total_pieces < 11){
        shipping = 7.50;
    }else shipping = 10.00;
    

    res.render('checkout',{
        inventory: inventory,
        cart: cart,
        prices: req.session.prices,
        subtotal: req.session.subtotal,
        shipping: shipping
    });

});
//edit shopping cart from checkout page
app.post('/edit', function (req,res){
     
    for(i = 0; i < inventory.length; i++){
        if(req.body["item"+i] != null){
            cart[i] = Number(req.body["item"+i]);
        }
    } 
        console.log(cart);

//calulate totals
        var total_pieces = 0;
        var subtotal = 0;
    for(i = 0; i < inventory.length; i++){
        prices[i] = inventory[i].price * Number(cart[i]);
        total_pieces = total_pieces + Number(cart[i]);
        subtotal = subtotal + prices[i];
        console.log("$",prices[i]);
    }
    req.session.subtotal = subtotal;
    req.session.total_pieces = total_pieces;
//calculate shipping
if(total_pieces < 5){
    shipping = 5.00;
}else if(total_pieces > 5 && total_pieces < 11){
    shipping = 7.50;
}else shipping = 10.00;
    
        res.render('checkout',{
            inventory: inventory,
            cart: cart,
            prices: prices,
            subtotal: subtotal,
            shipping: shipping
        });
        

    });




//continue shopping
app.post('/continue', function (req,res){
    res.render('index',{
        inventory: inventory
    });
});


//submit purchase order, send user to thankyou page, update inventory

app.post('/thankyou', function (req,res){
    var subtotal = req.session.subtotal;
    res.render('thankyou',{
        inventory: inventory,
        cart: cart,
        prices: prices,
        subtotal: subtotal,
        shipping: shipping
    });
    
//updating inventory

    for(i = 0; i < inventory.length; i++){
        inventory[i].quantityInStock = inventory[i].quantityInStock - Number(cart[i]);
    }

var jsonContent = JSON.stringify(inventory);

fs.writeFile('./inventory.json', jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("Inventory has been updated.");
});

});

//would like to figure out how to use this properly
/*fs.readFile(require.resolve('./inventory.json'), "utf-8", (err, data) => {
    if (err) {
        throw err;
    }
    var inventory = JSON.parse(data);
}); */






//start server on port 3000
app.listen(app.get('port'),function(){
    console.log(`Server is listening on port 3000`);
  });

  