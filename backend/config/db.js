const mysql = require('mysql2/promise');
require('dotenv').config(); 

const tenantPools = {};

const centralDb = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_CENTRAL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});

/**
 * * @param {string} 
 * @returns {Pool} 
 */
const getTenantPool = (tenantDbName) => {
    if (tenantPools[tenantDbName]) {
        return tenantPools[tenantDbName];
    }

    const newPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: tenantDbName, 
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    tenantPools[tenantDbName] = newPool;

    return newPool;
};

module.exports = { centralDb, getTenantPool };