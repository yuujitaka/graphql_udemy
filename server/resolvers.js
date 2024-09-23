import {
  getJobs,
  getJob,
  getJobsByCompany,
  createJob,
  deleteJob,
  updateJob,
} from './db/jobs.js';
import { getCompany } from './db/companies.js';
import { dateToISO } from './utils/date.js';
import { notFoundError, notAuthorizedError } from './utils/errors.js';

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: async (_root, args) => {
      const job = await getJob(args.id);

      if (!job) notFoundError(`No job found with id ${args.id}`);

      return job;
    },
    company: async (_root, args) => {
      const company = await getCompany(args.id);

      if (!company) notFoundError(`No company found with id ${args.id}`);

      return company;
    },
  },
  Mutation: {
    createJob: (_root, { input }, context) => {
      if (!context.user) notAuthorizedError('Missing valid token');
      return createJob({ ...input, companyId: context.user.companyId });
    },
    deleteJob: async (_root, { id }, context) => {
      if (!context.user) notAuthorizedError('Missing valid token');
      const job = await deleteJob(id, context.user.companyId);

      if (!job) {
        throw notFoundError(`No job found with id ` + id);
      }
      return job;
    },
    updateJob: async (_root, { input }, context) => {
      if (!context.user) notAuthorizedError('Missing valid token');
      const job = await updateJob({
        ...input,
        companyId: context.user.companyId,
      });

      if (!job) {
        throw notFoundError(`No job found with id ` + id);
      }
      return job;
    },
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
  Job: {
    date: (job) => dateToISO(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },
};
