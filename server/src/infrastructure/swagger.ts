import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TalentX API Documentation',
      version: '1.0.0',
      description: 'API documentation for the TalentX Backend Server',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            status: {
              type: 'integer',
              example: 400,
            },
            message: {
              type: 'string',
              example: 'Validation Error',
            },
            help: {
              type: 'string',
              example: 'Try again later or contact support.',
            },
          },
        },
      },
    },
  },
  apis: ['./src/interface/controllers/*.ts', './src/application/dtos/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
