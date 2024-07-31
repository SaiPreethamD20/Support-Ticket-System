const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Support Ticket System API',
            version: '1.0.0',
            description: 'API documentation for the Support Ticket System',
        },
        servers: [{
            url: 'http://localhost:5000',
        }, ],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    specs
};
