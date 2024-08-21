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
    jobsWithSpecificFields: async (parent, args, context, info) => {
      let fields = getRequestedFields(info);

      if (fields.includes('company')) {
        fields.push('companyId');
        fields = fields.filter((field) => field !== 'company');
      }

      return getFieldsJobs(fields);
    },
  },
  Job: {
    date: (job) => dateToISO(job.createdAt),
    company: (job) => getCompany(job.companyId),
    companySpecificFields: async (job, args, context, info) => {
      const fields = getRequestedFields(info);
      return getFieldsCompany(job.companyId, fields);
    },
  },
};
