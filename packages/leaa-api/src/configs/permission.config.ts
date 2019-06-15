import { shield, allow } from 'graphql-shield';

export const permissions = shield({
  // Query: {
  //   user: allow,
  // },
  // Mutation: {
  //   login: allow,
  //   createUser: allow,
  //   updateUser: allow,
  // },
});
