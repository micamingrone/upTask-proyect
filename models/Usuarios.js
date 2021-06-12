const sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');


const Usuarios = db.define('usuarios', {

    id:{
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email:{
        type: sequelize.STRING(60),
        allowNull: false,
        validate:{
            isEmail:{
                msg: 'Agrega un correo válido'
            },
            notEmpty:{
                msg: 'Escriba su correo electrónico'
            }
        },
        unique:{
            args: true,
            msg: 'Usuario ya registrado'
        }
        
    },

    password:{
        type: sequelize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty:{
                msg: 'El password no puede ir vacío'
            }
        }
    },
    
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
    
}, {
    hooks:{
            beforeCreate(usuario) {
                usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10) );
            }
        }
    }
);

//Métodos personalizados
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password,this.password);
} 

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;