export const RegisterUser = {
    type: 'object',
    required: ['name', 'email', 'password', 'confirmPassword'],
    properties: {
      name: {
        type: 'string',
        example: 'Jane Doe',
        description: 'Full name of the user',
      },
      email: {
        type: 'string',
        example: 'janedoe@example.com',
        description: 'Email address of the user',
      },
      password: {
        type: 'string',
        example: 'StrongP@ss1',
        description: 'Password for the user account. It must include at least one uppercase letter, one number, and one special character.',
      },
      confirmPassword: {
        type: 'string',
        example: 'StrongP@ss1',
        description: 'Confirmation of the password. Must match the password field.',
      },
      role: {
        type: 'string',
        enum: ['ADMIN', 'EMPLOYEE'],
        example: 'EMPLOYEE',
        description: 'Role of the user in the system (ADMIN or EMPLOYEE).',
      },
    },
  };
  