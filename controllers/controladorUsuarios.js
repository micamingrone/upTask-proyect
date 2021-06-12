const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en UpTask'
    }); 
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar cuenta en UpTask',
        error
    }); 
}


exports.crearCuenta = async (req, res) => {
    //Leer los datos
    const { email, password} = req.body;

    try {
        await 
        //Crear Usuario
        Usuarios.create({
            email,
            password
        });

        res.redirect('/iniciar-sesion')

    } catch (error) {
        //Primero, se genera el objeto de errores
        req.flash('error', error.errors.map(error => error.message));
        //Luego, se muestra en la vista
        res.render('crearCuenta', {
        mensajes: req.flash(),
        nombrePagina: 'Crear cuenta en UpTask',
        email,
        password
         }); 
        
    }

    

   
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}