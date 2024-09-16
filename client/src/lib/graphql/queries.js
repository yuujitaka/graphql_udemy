import { GraphQLClient, gql } from 'graphql-request';
import { getAccessToken } from '../auth';

//header sent in all requests, but can be set in specific requests
const client = new GraphQLClient('http://localhost:9000/graphql', {
  headers: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` };
    }
    return {};
  },
});

export const createJob = async ({ title, description }) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const { job } = await client.request(mutation, {
    input: { title, description },
  });
  return job;
};

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

export const getCompany = async (companyId) => {
  const query = gql`
    query ($companyId: ID!) {
      company(id: $companyId) {
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `;

  const { company } = await client.request(query, { companyId });
  return company;
};
