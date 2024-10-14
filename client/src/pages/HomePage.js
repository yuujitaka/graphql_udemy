import JobList from '../components/JobList';
import { useGetJobs } from '../lib/graphql/hooks';

function HomePage() {
  const { jobs, loading, error } = useGetJobs();

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='has-text-danger'>Something went wrong</div>;

  return (
    <div>
      <h1 className='title'>Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
