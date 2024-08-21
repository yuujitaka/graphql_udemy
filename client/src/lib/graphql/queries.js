import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('http://localhost:9000/graphql');

export const getJobs = async () => {
  const query = gql`
    {
      jobs {
        id
        title
        date
        company {
          name
          id
        }
      }
    }
  `;

  const { jobs } = await client.request(query);
  return jobs;
};
