const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const enviarEmail = require('../handlers/email');

//Autenticar usuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

//Función para saber si el usuario está logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    //Si el usuario está autenticado, entonces sigue el siguiente paso

    if(req.isAuthenticated()) {
        return next();
    }

    //Si no está autenticado, lo redirige al formulario de inicio de sesión
        return res.redirect('/iniciar-sesion');
}

//Función para cerrar sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

//Genera un Token si el usuario es válido
exports.enviarToken = async (req, res) => {
    //Verificando que el usuario existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: { email }});

    // Si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    //El usuario existe, generar token para cambiar la contraseña
    usuario.token = crypto.randomBytes(20).toString('hex');

    //Expiración del Token
    usuario.expiracion = Date.now() + 3600000;

    //Guardar los datos en la BD
    await usuario.save();

    //URL de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    //Terminar el proceso de reestablecimiento de contraseña y redireccionar para el inicio de sesión
    req.flash('correcto', 'Se envío un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}


exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    //Sino encuentra el usuario
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina : 'Reestablecer Contraseña'
    })
}

    //Cambia el password por uno nuevo
    exports.actualizarPassword = async (req, res) => {

    //Verifica el token válido pero también la fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    //Verificando si el usuario existe
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    //Hashear el nuevo password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;
    
    //Guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}