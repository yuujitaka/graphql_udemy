import { useMutation, useQuery } from '@apollo/client';
import {
  companyByIdQuery,
  getJobByIdQuery,
  getJobsQuery,
  createJobMutation,
} from './queries';

export const useCompanyQuery = (companyId) => {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { companyId },
  });

  return { company: data?.company, loading, error: Boolean(error) };
};

export const useGetJobQuery = (jobId) => {
  const { data, loading, error } = useQuery(getJobByIdQuery, {
    variables: { jobId },
  });

  return { job: data?.job, loading, error: Boolean(error) };
};

export const useGetJobsQuery = () => {
  const { data, loading, error } = useQuery(getJobsQuery, {
    fetchPolicy: 'network-only',
  });

  return { jobs: data?.jobs, loading, error: Boolean(error) };
};

export const useCreateJobMutation = () => {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async ({ title, description }) => {
    const {
      data: { job },
    } = await mutate({
      variables: {
        input: {
          title,
          description,
        },
      },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: getJobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });

    return job;
  };

  return {
    createJob,
    loading,
  };
};
