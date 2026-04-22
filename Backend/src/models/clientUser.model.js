const { sequelize } = require('../db/db');
const { DataTypes } = require('sequelize');
const apikey = require('./apiKey.model');

const clientUsers = sequelize.define('clientUsers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "please provide a valid email address"
            },
            isValidDomain(value) {
                const regex = /^[^\s@]+@[^\s@]+\.com$/;
                if (!regex.test(value)) {
                    throw new Error("Must be a valid .com email");
                }
            }
        }
    },

    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    apiKeyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'apikeys', // Name of the table
            key: 'id',
        }
    }
}, {
    freezeTableName: true,
    timestamps: true,
    indexes: [
        {
            fields: ['apiKeyId'] // Corrected: Must be an array of strings
        },
        {
            // Ensure email is unique ONLY within the same client
            fields: ['email', 'apiKeyId'] 
        }
    ]
});

module.exports = clientUsers;