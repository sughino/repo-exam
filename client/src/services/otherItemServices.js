import useSWR from 'swr';
import { useCallback } from 'react';
import { useAxiosRequest } from '../api/axiosRequest.js';
import { createApiWithRefresh } from '../api/securedApi.js';

const securedApi = createApiWithRefresh();

const filterTextMap = {
  'Request id': '_id',
  'Date': 'requestDate',
  'Price': 'unitCost',
  'Quantity': 'quantity',
};

const otherItemService = {

  useItem(searchedText, filterText, sortBy, filters ,options = {}) {
    const order = sortBy ? 'desc' : 'asc';
    const orderBy = Array.isArray(filterTextMap[filterText])
    ? filterTextMap[filterText].join(',')
    : filterTextMap[filterText];

    const url = `/get/approverequest?query=${searchedText}&orderBy=${orderBy}&sortBy=${order}&role=${filters.role}`;
    
    const { data, error, isValidating, mutate } = useSWR(
      url,
      (url) => securedApi.get(url).then(res => res.data),
      options
    );

    if (data) {
      localStorage.setItem('otherItemLength', data.length);
    }
    
    return {
      item: data || [],
      isLoading: !error && !data,
      isValidating,
      isError: error,
      mutate
    };
  },
  useModifyItem() {
    const { loading, error, makeRequest } = useAxiosRequest();

    const modifyItem = useCallback(async (_id, newStatus) => {
    const url = `/modify/approverequest`;
    return makeRequest(() => securedApi.put(url, {
        requestId: _id,
        newStatus: newStatus,
      })
    );
    }, [makeRequest]);

    return {
      isModifingLoading: loading,
      isModifyError: error,
      modifyItem
    };
    
  },
};

export default otherItemService;