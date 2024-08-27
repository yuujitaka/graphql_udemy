import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getCompany } from '../lib/graphql/queries';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();
  const [companyRequest, setCompanyRequest] = useState({
    company: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId);
        setCompanyRequest({
          company,
          loading: false,
          error: false,
        });
      } catch (error) {
        setCompanyRequest({
          company: null,
          loading: false,
          error: true,
        });
      }
    })();
  }, [companyId]);

  if (companyRequest.loading) {
    return <div>Loading...</div>;
  }

  if (companyRequest.error) {
    return (
      <div className='has-text-danger'>Data not available. Try again later</div>
    );
  }

  return (
    <div>
      <h1 className='title'>{companyRequest.company.name}</h1>
      <div className='box'>{companyRequest.company.description}</div>
      <h2 className='title'>Jobs</h2>
      <JobList jobs={companyRequest.company.jobs} />
    </div>
  );
}

export default CompanyPage;
