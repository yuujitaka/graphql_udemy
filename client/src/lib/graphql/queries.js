import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
  concat,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
// import { GraphQLClient } from 'graphql-request';
import { getAccessToken } from '../auth';

//header sent in all requests, but can be set in specific requests
/* const client = new GraphQLClient('http://localhost:9000/graphql', {
  headers: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` };
    }
    return {};
  },
}); */

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });

//course code
/* const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
}); */

//official docs code
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = getAccessToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  //global config
  /*  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  }, */
});

const getJobById = gql`
  query ($jobId: ID!) {
    job(id: $jobId) {
      id
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

export const createJob = async ({ title, description }) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
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

  /*  const { job } = await client.request(mutation, {
    input: { title, description },
  }); */
  const { data } = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description,
      },
    },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: getJobById,
        variables: { jobId: data.job.id },
        data,
      });
    },
  });
  //set header mutate({mutation, variables, context: {headers: {}}})
  return data.job;
};

export const getJob = async (jobId) => {
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

  //const { job } = await client.request(query, { jobId });
  const { data } = await apolloClient.query({
    query: getJobById,
    variables: { jobId },
  });
  return data.job;
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

  //const { jobs } = await client.request(query);
  const { data } = await apolloClient.query({
    query,
    //cache policy for individual request
    fetchPolicy: 'network-only',
  });

  return data.jobs;
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

  //const { company } = await client.request(query, { companyId });
  const { data } = await apolloClient.query({
    query,
    variables: { companyId },
  });
  return data.company;
};
