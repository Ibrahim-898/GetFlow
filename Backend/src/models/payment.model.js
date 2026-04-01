const { sequelize } = require('../db/db');
const { DataTypes } = require('sequelize');

const Payment = sequelize.define('payments', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  transaction_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  val_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  plan: {
    type: DataTypes.STRING,
  },
billingCycle: {
    type :DataTypes.STRING,
},

  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed', 'cancelled'),
    defaultValue: 'pending',
  },

}, {
  timestamps: true,
  freezeTableName: true
});

module.exports = Payment;