import { GraphQLError } from 'graphql';

export const notFoundError = (message) => {
  throw new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  });
};
