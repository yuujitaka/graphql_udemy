import { useState } from 'react';
import JobList from '../components/JobList';
import { useGetJobsQuery } from '../lib/graphql/hooks';

const JOBS_PER_PAGE = 15;

function HomePage() {
  const [offset, setOffset] = useState(0);
  const { jobs, totalCount, loading, error } = useGetJobsQuery(
    JOBS_PER_PAGE,
    offset
  );
  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);
  const currentPage = Math.floor(offset / JOBS_PER_PAGE) + 1;

  const handlePagination = (type) => {
    setOffset((prevOffset) =>
      type === 'next' ? prevOffset + JOBS_PER_PAGE : prevOffset - JOBS_PER_PAGE
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='has-text-danger'>Something went wrong</div>;

  return (
    <div>
      <h1 className='title'>Job Board</h1>
      <div>
        <button
          onClick={() => handlePagination('previous')}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className='mx-1'>{`${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePagination('next')}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
