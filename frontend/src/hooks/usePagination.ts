import { useMemo, useState, useEffect } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

export const usePagination = <T>({ data, itemsPerPage }: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [data.length, itemsPerPage, currentPage]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    return {
      currentData,
      totalPages,
      currentPage,
      totalItems: data.length,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    };
  }, [data, itemsPerPage, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const resetPage = () => setCurrentPage(1);

  return {
    ...paginationData,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
  };
};