'use client';

import {
    useQuery,
    type QueryKey,
    type UseQueryOptions,
    type UseQueryResult,
} from '@tanstack/react-query';

import { applySmartCaching } from './smartCaching';

export function useSmartQuery<TQueryFnData, TError, TData = TQueryFnData, TKey extends QueryKey = QueryKey>(
    options: UseQueryOptions<TQueryFnData, TError, TData, TKey>
): UseQueryResult<TData, TError> {
    return useQuery(applySmartCaching(options));
}
