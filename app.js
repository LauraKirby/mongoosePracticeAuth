var express = require("express"),
  app = express(),
  methodOverride = require('method-override'),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  db = require("./models"),

  loginMiddleware = require("./middleware/loginHelper"); 
  routeMiddleware = require("./middleware/routeHelper"); 

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

app.use(session({
  maxAge: 3600000,
  secret: 'illnevertell', 
  name: 'chocolate chip'
}));

//we are calling loginMiddleware
//you will have access to the functions within loginMiddleware 
//within every request
app.use(loginMiddleware); 

app.get('/', routeMiddleware.ensureLoggedIn, function(req,res){
  res.redirect('countries/login');
});

app.get('/login', function(req,res){
  res.render("countries/login")
});

app.post("/login", function(req, res) {
  res.render('users/signup'); 
});

app.post("/login", function(req,res) {
  var newUser = req.body.user; 
  db.User.create(newUser, function(err, user){
    if(user){
      req.login(user); 
      res.redirect("/countries")
    } else {
      console.log(err); 
      res.render("countries/")
    }
  });
});


// ------- LOGIN ----------
// app.get("/login", routeMiddleware.preventLoginSignup, function (req, res) {
//   res.render("users/login");
// });

// app.post("/login", function (req, res) {
//   db.User.authenticate(req.body.user,
//   function (err, user) {
//     if (!err && user !== null) {
//       req.login(user);
//       res.redirect("/puppies");
//     } else {
//       // TODO - handle errors in ejs!
//       res.render("users/login");
//     }
//   });
// });



// INDEX
app.get('/countries', function(req,res){
  db.Country.find({},function(err,countries){
    if (err) throw err;
    res.render("countries/index", {countries:countries});
  });
});

// NEW
app.get('/countries/new', function(req,res){
  res.render("countries/new");
});

// CREATE
app.post('/countries', function(req,res){
    var country = new db.Country(req.body.country);
    var cities = req.body.cities.split(", ");
    country.cities = cities;
    country.save(function(err){
      if (err) throw err;
      res.redirect('/countries');
    });
});

// SHOW

app.get('/countries/:id', function(req,res){
  db.Country.findById(req.params.id,function(err,country){
    if (err) throw err;
    res.render("countries/show", {country:country});
  });
});

// EDIT

app.get('/countries/:id/edit', function(req,res){
  db.Country.findById(req.params.id,function(err,country){
    if (err) throw err;
    res.render("countries/edit", {country:country});
  });
});

// UPDATE
app.put('/countries/:id', function(req,res){
  db.Country.findById(req.params.id,function(err,country){
    // loop over all keys in object
    for(var prop in req.body.country){
      country.prop = req.body.country[prop];
    }
    country.cities = req.body.cities.split(", ");
    country.save(function(err,country){
      if (err) throw err;
      res.redirect('/countries');
    });
  });
});

// DESTROY
app.delete('/countries/:id', function(req,res){
    db.Country.findByIdAndRemove(req.params.id, function(err,book){
      if (err) throw err;
      res.redirect('/countries');
    });
});

// CATCH ALL
app.get('*', function(req,res){
  res.render('404');
});

app.listen(3000, function(){
  "Server is listening on port 3000";
});
