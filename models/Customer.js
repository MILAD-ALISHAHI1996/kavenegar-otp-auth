const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // فرض بر اینکه فایل database.js جدا داری

const Customer = sequelize.define('Customer', {
  CustomerID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  CustomerUniqueID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PhoneNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  FirstName: DataTypes.STRING,
  LastName: DataTypes.STRING,
  Email: DataTypes.STRING,
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Customer;
