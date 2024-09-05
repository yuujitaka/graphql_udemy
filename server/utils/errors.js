import { GraphQLError } from 'graphql';

export const notFoundError = (message) => {
  throw new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  });
};

export const notAuthorizedError = (message) => {
  throw new GraphQLError(message, {
    extensions: { code: 'NOT_AUTHORIZED' },
  });
};
