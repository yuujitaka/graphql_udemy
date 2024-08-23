import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('http://localhost:9000/graphql');

export const getJobs = async () => {
  const query = gql`
    query {
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

export const getJob = async (jobId) => {
  //with variables
  const query = gql`
    query ($jobId: ID!) {
      job(id: $jobId) {
        title
        date
        description
        company {
          id
          name
        }
      }
    }
  `;

  /*  OR without variables
  const query = gql`
    {
      job(id: "${jobId}") {
        title
        date
        description
        company {
          id
          name
        }
      }
    }
  `; */

  const { job } = await client.request(query, { jobId });
  return job;
};
