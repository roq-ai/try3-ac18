import axios from 'axios';
import queryString from 'query-string';
import { CourseContentInterface, CourseContentGetQueryInterface } from 'interfaces/course-content';
import { GetQueryInterface } from '../../interfaces';

export const getCourseContents = async (query?: CourseContentGetQueryInterface) => {
  const response = await axios.get(`/api/course-contents${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCourseContent = async (courseContent: CourseContentInterface) => {
  const response = await axios.post('/api/course-contents', courseContent);
  return response.data;
};

export const updateCourseContentById = async (id: string, courseContent: CourseContentInterface) => {
  const response = await axios.put(`/api/course-contents/${id}`, courseContent);
  return response.data;
};

export const getCourseContentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/course-contents/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCourseContentById = async (id: string) => {
  const response = await axios.delete(`/api/course-contents/${id}`);
  return response.data;
};
