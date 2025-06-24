import useSWR from 'swr';
import { useCallback } from 'react';
import { useAxiosRequest } from '../api/axiosRequest.js';
import { createApiWithRefresh } from '../api/securedApi.js';

const securedApi = createApiWithRefresh();

const filterTextMap = {
  'User id': '_id',
  'Name & Surname': ['name', 'surname'],
  'Email': 'email',
  'Admin': 'admin'
};

const userService = {

  useUser(searchedText, filterText, sortBy, filters ,options = {}) {
    const order = sortBy ? 'desc' : 'asc';
    const orderBy = Array.isArray(filterTextMap[filterText])
    ? filterTextMap[filterText].join(',')
    : filterTextMap[filterText];

    const url = `/get/user?query=${searchedText}&orderBy=${orderBy}&sortBy=${order}&role=${filters.role}`;
    
    const { data, error, isValidating, mutate } = useSWR(
      url,
      (url) => securedApi.get(url).then(res => res.data),
      options
    );

    if (data) {
      localStorage.setItem('userLength', data.length);
    }
    
    return {
      users: data || [],
      isLoading: !error && !data,
      isValidating,
      isError: error,
      mutate
    };
  },
  useUserInsertion() {
    const { loading, error, makeRequest } = useAxiosRequest();

    const insertUser = useCallback(async (formData) => {
      const url = `/insert/user`;
      
      return makeRequest(() => securedApi.post(url, formData));
    }, [makeRequest]);

    return {
      isInsertLoading: loading,
      isInsertError: error,
      insertUser
    };
  },
  useModifyUser() {
    const { loading, error, makeRequest } = useAxiosRequest();

    const modifyUser = useCallback(async (formData) => {
      const url = `/modify/user`;

      return makeRequest(() => securedApi.put(url, formData));
    }, [makeRequest]);

    return {
      isModifingLoading: loading,
      isModifyError: error,
      modifyUser
    };
  },
  useDeleteUser() {
    const { loading, error, makeRequest } = useAxiosRequest();

    const deleteUser = useCallback(async (_id) => {
      const url = `/delete/user`;
      
      return makeRequest(() => securedApi.delete(url, {
        data: { _id }
      }));
    }, [makeRequest]);

    return {
      isDeletingLoading: loading,
      isDeleteError: error,
      deleteUser
    };
  }
};

export default userService;