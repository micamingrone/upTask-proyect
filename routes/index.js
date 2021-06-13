const express = require('express');
const router = express.Router();

//importar Express Validator
const {body} = require('express-validator/check');

//importar controlador
const controladorProyecto = require('../controllers/controladorProyecto');
const controladorTareas = require('../controllers/controladorTareas');
const controladorUsuarios = require('../controllers/controladorUsuarios');
const controladorAuth = require('../controllers/controladorAuth');


module.exports = function()  {
    //Ruta para el home
    router.get('/',
        controladorAuth.usuarioAutenticado,
        controladorProyecto.proyectosHome);

    router.get('/nuevo-proyecto', 
         controladorAuth.usuarioAutenticado,
        controladorProyecto.formularioProyecto);

    router.post('/nuevo-proyecto',
         controladorAuth.usuarioAutenticado,
         body ('nombre').not().isEmpty().trim().escape(),
         controladorProyecto.nuevoProyecto
         );

    //Lista de  proyectos  
    router.get('/proyectos/:url', 
         controladorAuth.usuarioAutenticado,
         controladorProyecto.proyectoPorUrl);

    //Actualización de proyectos
    router.get('/proyecto/editar/:id',
         controladorAuth.usuarioAutenticado,
         controladorProyecto.formularioEditar);

    router.post('/nuevo-proyecto/:id',
         controladorAuth.usuarioAutenticado,
         body ('nombre').not().isEmpty().trim().escape(),
         controladorProyecto.actualizarProyecto
    );

    //Eliminar proyectos
    router.delete('/proyectos/:url', 
        controladorAuth.usuarioAutenticado,
        controladorProyecto.eliminarProyecto);

    //Agregar tareas a un proyecto
    router.post('/proyectos/:url', 
        controladorAuth.usuarioAutenticado,
        controladorTareas.agregarTarea);

    //Actualizar tareas
    router.patch('/tareas/:id',
        controladorAuth.usuarioAutenticado,
        controladorTareas.cambiarEstadoTarea);

    //Eliminando tareas
    router.delete('/tareas/:id',
        controladorAuth.usuarioAutenticado,
        controladorTareas.eliminarTarea);

    //Crear nueva cuenta
    router.get('/crear-cuenta', controladorUsuarios.formCrearCuenta);
    router.post('/crear-cuenta', controladorUsuarios.crearCuenta);
    router.get('/confirmar/:correo' , controladorUsuarios.confirmarCuenta)

    //Iniciar sesión en UpTask
    router.get('/iniciar-sesion', controladorUsuarios.formIniciarSesion);
    router.post('/iniciar-sesion', controladorAuth.autenticarUsuario);
    
    //Cerrar sesión
    router.get('/cerrar-sesion', controladorAuth.cerrarSesion);

    //Reestablecer el password
    router.get('/reestablecer', controladorUsuarios.formRestablecerPassword);
    router.post('/reestablecer', controladorAuth.enviarToken);
    router.get('/reestablecer/:token', controladorAuth.validarToken);
    router.post('/reestablecer/:token', controladorAuth.actualizarPassword);

    return router;
}