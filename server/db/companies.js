import DataLoader from 'dataloader';
import { connection } from './connection.js';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

export async function getFieldsCompany(id, fields) {
  return await getCompanyTable().select(fields).first().where({ id });
}

export const createCompanyLoader = () => {
  return new DataLoader(async (ids) => {
    const companies = await getCompanyTable().select().whereIn('id', ids);
    //ids order
    const result = ids.map((id) =>
      companies.find((company) => company.id === id)
    );

    return result;
  });
};
