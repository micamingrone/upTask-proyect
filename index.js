const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const {body} = require('express-validator');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookie = require('cookie-parser');
const passport = require('./config/passport');

//Importar el modelo 
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

//Creando la conexión a la BD
const db = require('./config/db');
const cookieParser = require('cookie-parser');

db.sync()
    .then (() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));


//Creando la app de express
const app = express();
app.use(express.json());

//Donde cargar los archivos estáticos
app.use(express.static('public'));

//Habilitar pug
app.set('view engine','pug');

//Habilitar bodyParser para leer los datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//Añadir Flash Messages
app.use(flash());

//Session-cookies que nos permiten navegar en las distintas páginas sin volver a autenticar
app.use(cookieParser());
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user } || null;
    console.log(res.locals.usuario);
    next();
    
});



//Ruta para el home

app.use('/', routes());


//Configurando el puerto

app.listen(3000);

