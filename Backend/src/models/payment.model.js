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
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  transaction_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  val_id: {
    type: DataTypes.STRING,
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  plan: {
    type: DataTypes.STRING,
  },

  billingCycle: {
    type: DataTypes.STRING,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'success', 'failed', 'cancelled']]
    }
  },

 
}, {
  timestamps: true,
  freezeTableName: true,
  indexes: [
    { fields: ['user_id'] }
  ]
});

module.exports = Payment;