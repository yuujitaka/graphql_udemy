import { useQuery } from '@apollo/client';
import { companyByIdQuery, getJobByIdQuery, getJobsQuery } from './queries';

export const useCompanyQuery = (companyId) => {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { companyId },
  });

  return { company: data?.company, loading, error: Boolean(error) };
};

export const useGetJob = (jobId) => {
  const { data, loading, error } = useQuery(getJobByIdQuery, {
    variables: { jobId },
  });

  return { job: data?.job, loading, error: Boolean(error) };
};

export const useGetJobs = () => {
  const { data, loading, error } = useQuery(getJobsQuery, {
    fetchPolicy: 'network-only',
  });

  return { jobs: data?.jobs, loading, error: Boolean(error) };
};
