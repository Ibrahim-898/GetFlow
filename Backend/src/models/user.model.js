const { sequelize } = require('../db/db');
const { DataTypes } = require('sequelize');

const user = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },

    email: {
        type: DataTypes.STRING(100),
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

    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
    },

   
    plan: {
        type: DataTypes.ENUM('free', 'pro', 'enterprise'),
        allowNull: false,
        defaultValue: 'free',
    },

    
    planExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }

}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = user;