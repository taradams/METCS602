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
var subtotal = 0;
app.post('/checkout', function (req,res){
    console.log('Form (from querystring): ' + req.query.form);

    //console.log(req.body);
    //console.log(inventory);
    req.session.cart = req.body;
    var cart = req.session.cart;

   for(i = 0; i < inventory.length; i++){
        //console.log("$",inventory[i].price * cart["item"+i]);
        prices[i] = inventory[i].price * cart["item"+i];
        subtotal = subtotal + prices[i];
        console.log("$",prices[i]);
    }
    console.log("$",subtotal);
    res.render('checkout',{
        inventory: inventory,
        cart: cart,
        prices: prices,
        subtotal: subtotal
    });

});



//edit shopping cart from checkout page
app.post('/edit', function (req,res){


    //res.sendFile(__dirname + '/views/index.html');
    //res.send(req.session.cart);
    
});


//submit purchase order, send user to thankyou page, update inventory

/*fs.readFile(require.resolve('./inventory.json'), "utf-8", (err, data) => {
    if (err) {
        throw err;
    }
    var inventory = JSON.parse(data);
}); */




//updating inventory
/*inventory[0].itemName = "cheese";
console.log(inventory[0].itemName);
console.log(inventory);

var jsonContent = JSON.stringify(inventory);

fs.writeFile('./inventory.json', jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});
*/

//start server on port 3000
app.listen(app.get('port'),function(){
    console.log(`Server is listening on port 3000`);
  });

  