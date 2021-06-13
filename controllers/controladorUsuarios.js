const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

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

        //Crear una URL de confirmación del usuario
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //Crear el objeto de usuario
        const usuario = {
            email
        }

        //Enviar el email de confirmación
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        //Redireccionar al usuario al inicio de sesión una vez creada y confirmada la cuenta
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
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
    //Restableciendo la contraseña
exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

    //Cambiar el estado de una cuenta
    exports.confirmarCuenta = async (req, res) => {
        const usuario = await Usuarios.findOne({
            where: {
                email: req.params.correo
            }
        });
    
        //Si el usuario no existe entonces
        if(!usuario) {
            req.flash('error', 'No valido');
            res.redirect('/crear-cuenta');
        }
    
        usuario.activos = 1;
        await usuario.save();
    
        req.flash('correcto', 'Cuenta activada correctamente');
        res.redirect('/iniciar-sesion');
    
    }