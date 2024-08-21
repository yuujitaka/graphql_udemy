import { getJobs, getFieldsJobs } from './db/jobs.js';
import { getCompany, getFieldsCompany } from './db/companies.js';
import { dateToISO } from './utils/date.js';

const getRequestedFields = (info) => {
  return info.fieldNodes[0].selectionSet.selections.map(
    (field) => field.name.value
  );
};

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
  },
  Job: {
    date: (job) => dateToISO(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },
};
