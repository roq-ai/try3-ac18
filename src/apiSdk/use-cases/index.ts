import axios from 'axios';
import queryString from 'query-string';
import { UseCaseInterface, UseCaseGetQueryInterface } from 'interfaces/use-case';
import { GetQueryInterface } from '../../interfaces';

export const getUseCases = async (query?: UseCaseGetQueryInterface) => {
  const response = await axios.get(`/api/use-cases${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createUseCase = async (useCase: UseCaseInterface) => {
  const response = await axios.post('/api/use-cases', useCase);
  return response.data;
};

export const updateUseCaseById = async (id: string, useCase: UseCaseInterface) => {
  const response = await axios.put(`/api/use-cases/${id}`, useCase);
  return response.data;
};

export const getUseCaseById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/use-cases/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUseCaseById = async (id: string) => {
  const response = await axios.delete(`/api/use-cases/${id}`);
  return response.data;
};
