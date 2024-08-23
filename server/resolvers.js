import { getJobs, getJob } from './db/jobs.js';
import { getCompany } from './db/companies.js';
import { dateToISO } from './utils/date.js';

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: (_root, args) => getJob(args.id),
  },
  Job: {
    date: (job) => dateToISO(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },
};
