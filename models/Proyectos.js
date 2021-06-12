const sequelize = require('sequelize');
const slug = require('slug');
const shortid = require('shortid');

const db = require('../config/db');

const Proyectos =db.define('proyectos',{
    id:{
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: sequelize.STRING,
    url: sequelize.STRING
},{
    hooks:{
        beforeCreate(proyecto){
            const url = slug(proyecto.nombre).toLowerCase();

            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
}

);


module.exports = Proyectos;