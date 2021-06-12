const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const slug = require('slug');


exports.proyectosHome = async (req,res) => {

    // console.log(res.locals.usuario);

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});
    
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});
    //Enviar a consola lo que el user escriba
    // console.log(req.body);

    //validar que tengamos algo en el input
    const {nombre} = req.body;

    let errores = [];

    //Si el user no ingresa nada en el input

    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }

    //Si existen errores

    if(errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else {
        //No hay errores
        const usuarioId = res.locals.usuario.id;
        //Insertar en BD
        await Proyectos.create ({ nombre, usuarioId })
            res.redirect('/');

    }

}

exports.proyectoPorUrl = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId }});
    
    const proyectoPromise = Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },

        // include: [{
        //     model: Proyectos
        // }]
        
    });

    if(!proyecto) return next();

   //Renderizando la vista
   res.render('tareas', {
       nombrePagina: 'Tareas del Proyecto',
       proyecto,
       proyectos,
       tareas
   });
}


exports.formularioEditar = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId }});
    
    const proyectoPromise = Proyectos.findOne({
        where:{
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Renderizar vista
    res.render('nuevoProyecto', {
    nombrePagina : 'Editar Proyecto',
    proyectos,
    proyecto  

    });
}

exports.actualizarProyecto = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});
    //Enviar a consola lo que el user escriba
    // console.log(req.body);

    //validar que tengamos algo en el input
    const {nombre} = req.body;

    let errores = [];

    //Si el user no ingresa nada en el input

    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }

    //Si existen errores

    if(errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else {
        //No hay errores
        //Modificar el nombre del proyecto - update
        await Proyectos.update(
            { nombre : nombre },
            { where : { id : req.params.id}}

            );
            res.redirect('/');

    }

}

exports.eliminarProyecto = async (req, res, next) => {
    // req, query o params
    // console.log(req.query);
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: { url : urlProyecto}});

    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}    