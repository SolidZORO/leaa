// import { HttpLink } from 'apollo-link-http';
// import { onError } from 'apollo-link-error';
// import { ApolloLink, split } from 'apollo-link';
// import { ApolloClient } from 'apollo-client';
// import { getAuthToken, removeAuth, errorMsg, getCurrentLang } from '@leaa/dashboard/src/utils';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { OperationDefinitionNode } from 'graphql';
//
// import { envConfig } from '@leaa/dashboard/src/configs';
// import { LOGOUT_REDIRECT_URL } from '@leaa/dashboard/src/constants';
//
// const ignoreErrorPath = ['loginByTicket', 'userByToken', 'demoData'];
//
// const httpLink = new HttpLink({
//   uri: envConfig.GRAPHQL_ENDPOINT,
//   // credentials: 'same-origin',
// });
//
// const authLink = new ApolloLink((operation, forward) => {
//   const token = getAuthToken();
//
//   operation.setContext({
//     headers: {
//       Authorization: token ? `Bearer ${token}` : '',
//       'Accept-Language': getCurrentLang(),
//     },
//   });
//
//   return forward(operation);
// });
//
// const errorLink = onError(({ graphQLErrors }) => {
//   if (graphQLErrors) {
//     graphQLErrors.forEach((err) => {
//       if (!ignoreErrorPath.includes(`${err.path}`)) {
//         console.error('❌ ERROR >>>>', err, '📌 STACKTRACE >>>>', err.extensions?.exception?.stacktrace);
//         errorMsg(err.message);
//       }
//
//       // TIPS: @see /leaa-api/src/utils/err.util.ts mapping code
//       // @ts-ignore
//       if (err.statusCode === 401) {
//         const removed = removeAuth();
//
//         if (removed && window.location.pathname !== LOGOUT_REDIRECT_URL) {
//           window.location.href = LOGOUT_REDIRECT_URL;
//         }
//       }
//     });
//   }
// });
//
// const terminatingLink = split(
//   ({ query: { definitions } }) =>
//     definitions.some((node) => {
//       const { kind } = node as OperationDefinitionNode;
//
//       return kind === 'OperationDefinition';
//     }),
//   httpLink,
// );
//
// export const apolloClient = new ApolloClient({
//   link: ApolloLink.from([authLink, errorLink, terminatingLink]),
//   cache: new InMemoryCache(),
// });
