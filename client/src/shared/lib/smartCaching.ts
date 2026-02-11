import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { getDatasetTypeByKey, type DatasetType } from './datasetPolicy';

export const staticQueryDefaults = {
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
} as const;

export const dynamicQueryDefaults = {
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
} as const;

export function getDatasetType(queryKey: QueryKey): DatasetType {
    return getDatasetTypeByKey(queryKey);
}

export function applySmartCaching<TQueryFnData, TError, TData, TKey extends QueryKey>(
    options: UseQueryOptions<TQueryFnData, TError, TData, TKey>
): UseQueryOptions<TQueryFnData, TError, TData, TKey> {
    const datasetType = getDatasetType(options.queryKey as unknown as QueryKey);

    if (datasetType === 'static') {
        return {
            ...staticQueryDefaults,
            ...options,
        };
    }

    return {
        ...dynamicQueryDefaults,
        ...options,
    };
}
