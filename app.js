// Initialization
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Files init
var formidable = require('formidable');

// SQLite init
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('base.db');

// Cookies init
var cookiesParser = require('cookie-parser');
app.use(cookiesParser());

// Session init
var session = require('express-session');
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "compsci719"
}));

// Passport init
var passport = require('passport');
var localStratagy = require('passport-local').Strategy;

// Hash bcrypt
var bcrypt = require('bcrypt');

// PostgreSQL init
var pg = require('pg');
var Pool = require('pg-pool');
var config = {
    user: 'kxluyftrafeiuf',
    password: '572a8fb732c3c86cb4d1fd66368a4d2f1d70034a72f6902d7c5863a30882bc57',
    host: 'ec2-107-20-237-78.compute-1.amazonaws.com',
    port: '5432',
    database: 'dco5q369beqoq6',
    ssl: true
};
var pool = new Pool(config);

// PostgreSQL functions
function query(sql, params, callback) {
    pool.connect(function (err, client, done) {

        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(sql, params, function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
            }
            if (callback) {
                callback(err, result);
            }
        });

    });
};


//Authorisation
getUser = function (username, callback) {
    username = username.toLowerCase();
    db.all('SELECT * FROM user WHERE username = ?', [username], function (err, rows) {
        if (rows.length > 0) {
            callback(rows[0]);
        } else {
            callback(null);
        }
    });
};



var localStratagy = new localStratagy(
    function (username, password, done) {
        getUser(username, function (user) {
            if (!user) {
                return done(null, false, { message: 'Invalid user' });
            };
            if (bcrypt.compareSync(user.password, password)) {
                return done(null, false, { message: 'Invalid password' });
            };

            done(null, user);
        });
    }
);

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    getUser(username, function (user) {
        done(null, user);
    });
});

passport.use('local', localStratagy);

app.use(passport.initialize());
app.use(passport.session());

// Handlebars
var handlebars = require('express-handlebars');
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



// Initialize port
app.set('port', process.env.PORT || 8080);

// Initialize folder
app.use(express.static(path.join(__dirname, 'public')));


//home and login
app.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    else {
        var data = {
            bgPicture: "banner_login",
            height: "height: 25%",
            loginFail: req.query.loginFail
        }
        res.render('login', data);
    }
});


app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login?loginFail=true'
    }
));

//logout
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// Start the site
app.get('/' || '/index', function (req, res) {
    if (req.isAuthenticated()) {
        var username = req.user.username;
    }
    query("SELECT \"article_ID\", \"content\" FROM \"article\" WHERE \"article_ID\"='1'", [], function (err, rows) {
        var articles = rows.rows;
        var data = {
            articles: articles,
            bgPicture: "latinfiesta",
            username: username,
            home: true
        };
        res.render('index', data);
    });

});

app.get('/entertainment', function (req, res) {
    if (req.isAuthenticated()) {
        var username = req.user.username;
    }
    query("SELECT \"article_ID\", \"content\" FROM \"article\" WHERE \"article_ID\" = '3'", [], function (err, rows) {
        var articles = rows.rows;
        var data = {
            articles: articles,
            bgPicture: "Featuring/entertainment",
            height: "height: 25%",
            username: username
        }
        res.render('features', data);
    });
});

app.get('/food', function (req, res) {
    if (req.isAuthenticated()) {
        var username = req.user.username;
    }
    query("SELECT \"article_ID\", \"content\" FROM \"article\" WHERE \"article_ID\" = '2'", [], function (err, rows) {
        var articles = rows.rows;
       
        var data = {
            articles: articles,
            bgPicture: "Featuring/food",
            height: "height: 25%",
            username: username
        }

        res.render('features', data);
    });
});

app.get('/freeclasses', function (req, res) {
    if (req.isAuthenticated()) {
        var username = req.user.username;
    }
    query("SELECT \"article_ID\", \"content\" FROM \"article\" WHERE \"article_ID\" = '4'", [], function (err, rows) {
        var articles = rows.rows;
        var data = {
            articles: articles,
            bgPicture: "Featuring/dance_classes",
            height: "height: 25%",
            username: username
        }
        res.render('features', data);
    });
});

app.get('/music', function (req, res) {
    if (req.isAuthenticated()) {
        var username = req.user.username;
    }
    query("SELECT \"article_ID\", \"content\" FROM \"article\" WHERE \"article_ID\" = '5'", [], function (err, rows) {
        var articles = rows.rows;
        var data = {
            articles: articles,
            bgPicture: "Featuring/music",
            height: "height: 25%",
            username: username
        }
        res.render('features', data);
    });
});

app.get('/parties', function (req, res) {
    if (req.isAuthenticated()) {
        var username = req.user.username;
    }
    query("SELECT \"article_ID\", \"content\" FROM \"article\" WHERE \"article_ID\" = '6'", [], function (err, rows) {
        var articles = rows.rows;
        var data = {
            articles: articles,
            bgPicture: "Featuring/parties",
            height: "height: 25%",
            username: username
        }
        res.render('features', data);
    });
});

app.get('/markets', function (req, res) {
    if (req.isAuthenticated()) {
        var username = req.user.username;
    }
    query("SELECT \"article_ID\", \"content\" FROM \"article\" WHERE \"article_ID\" = '7'", [], function (err, rows) {
        var articles = rows.rows;
        var data = {
            articles: articles,
            bgPicture: "Featuring/market",
            height: "height: 25%",
            username: username
        }
        res.render('features', data);
    });
});

app.get('/addArticle', function (req, res) {
    if (req.isAuthenticated()) {
        var username = req.user.username;
        res.render('addArticle', { username: username, height: "height: 25%", bgPicture: "latinfiesta" });
    } else {
        res.redirect('/login');
    }
});

app.post('/addArticle', function (req, res) {
    var username = req.user.username;
    var form = new formidable.IncomingForm();


    form.parse(req, function (err, fields) {
        var content = fields.articleSubmission;
        query("INSERT INTO \"article\" (\"content\", \"username\") VALUES ($1, $2)", [content, username], function (err) {
            res.redirect('/');
        });
    });
});


app.get('/edit/:article_ID', function (req, res) {
    if (req.isAuthenticated()) {
        var username = req.user.username;
        var articleID = req.params.article_ID;
        query("SELECT \"content\" FROM \"article\" WHERE \"article_ID\" = $1", [articleID], function (err, rows) {
            var loadArticle = rows.rows[0];
            var data = {
                username: username,
                bgPicture: "latinfiesta",
                height: "height: 25%",
                content: loadArticle.content,
                article_ID: articleID,
                edit: true
            }
            res.render('addArticle', data);
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/editArticle', function (req, res) {
    var username = req.user.username;
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {
        var content = fields.articleSubmission;
        var articleID = fields.articleID;
        
        query("UPDATE \"article\" SET \"content\"='"+ content +"' WHERE \"article_ID\"='"+ articleID +"'", [], function (err) {
            res.redirect('/');
        });
    });

});

// Run teh whole thing from port 8080
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port'));
});