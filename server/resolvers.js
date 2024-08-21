import { getJobs } from './db/jobs.js';
import { dateToISO } from './utils/date.js';

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
  },
  Job: {
    date: (job) => dateToISO(job.createdAt),
  },
};
