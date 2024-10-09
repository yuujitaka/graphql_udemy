import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
  concat,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAccessToken } from '../auth';

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });

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

const jobFragment = gql`
  fragment JobDetail on Job {
    id
    title
    date
    description
    company {
      id
      name
    }
  }
`;

const getJobByIdQuery = gql`
  query JobById($jobId: ID!) {
    job(id: $jobId) {
      ...JobDetail
    }
  }
  ${jobFragment}
`;

export const createJob = async ({ title, description }) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${jobFragment}
  `;

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
        query: getJobByIdQuery,
        variables: { jobId: data.job.id },
        data,
      });
    },
  });
  //set header mutate({mutation, variables, context: {headers: {}}})
  return data.job;
};

export const getJob = async (jobId) => {
  const { data } = await apolloClient.query({
    query: getJobByIdQuery,
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

  const { data } = await apolloClient.query({
    query,
    variables: { companyId },
  });

  return data.company;
};
