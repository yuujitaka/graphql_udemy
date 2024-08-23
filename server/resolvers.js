import { getJobs, getJob, getJobsByCompany } from './db/jobs.js';
import { getCompany } from './db/companies.js';
import { dateToISO } from './utils/date.js';

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: (_root, args) => getJob(args.id),
    company: (_root, args) => getCompany(args.id),
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
  Job: {
    date: (job) => dateToISO(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },
};
