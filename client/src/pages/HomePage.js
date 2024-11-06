import { useState } from 'react';
import JobList from '../components/JobList';
import PaginationBar from '../components/PaginationBar';
import { useGetJobsQuery } from '../lib/graphql/hooks';

const JOBS_PER_PAGE = 8;

function HomePage() {
  const [offset, setOffset] = useState(0);
  const { jobs, totalCount, loading, error } = useGetJobsQuery(
    JOBS_PER_PAGE,
    offset
  );
  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);
  const currentPage = Math.floor(offset / JOBS_PER_PAGE) + 1;

  const handlePagination = (page) => {
    setOffset((page - 1) * JOBS_PER_PAGE);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='has-text-danger'>Something went wrong</div>;

  return (
    <div>
      <h1 className='title'>Job Board</h1>
      <div>
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePagination}
        />
      </div>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
