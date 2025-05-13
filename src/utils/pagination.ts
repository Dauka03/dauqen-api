import { Request } from 'express';
import { DEFAULT_PAGINATION } from './constants';

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export const getPaginationOptions = (req: Request): PaginationOptions => {
  const page = parseInt(req.query.page as string) || DEFAULT_PAGINATION.PAGE;
  const limit = parseInt(req.query.limit as string) || DEFAULT_PAGINATION.LIMIT;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export const getPaginationResponse = (
  totalItems: number,
  currentPage: number,
  limit: number
): {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage: limit,
    hasNextPage,
    hasPreviousPage,
  };
};

export const validatePaginationParams = (
  page: number,
  limit: number
): { isValid: boolean; message?: string } => {
  if (page < 1) {
    return {
      isValid: false,
      message: 'Page number must be greater than 0',
    };
  }

  if (limit < 1) {
    return {
      isValid: false,
      message: 'Limit must be greater than 0',
    };
  }

  if (limit > 100) {
    return {
      isValid: false,
      message: 'Limit cannot exceed 100 items per page',
    };
  }

  return { isValid: true };
};

export const getSortOptions = (req: Request): { [key: string]: 1 | -1 } => {
  const sortBy = req.query.sortBy as string;
  const sortOrder = req.query.sortOrder as string;

  if (!sortBy) {
    return { createdAt: -1 }; // По умолчанию сортировка по дате создания (новые сначала)
  }

  const order = sortOrder === 'asc' ? 1 : -1;
  return { [sortBy]: order };
};

export const getFilterOptions = (req: Request): { [key: string]: any } => {
  const filter: { [key: string]: any } = {};

  // Удаляем параметры пагинации и сортировки
  const queryParams = { ...req.query };
  delete queryParams.page;
  delete queryParams.limit;
  delete queryParams.sortBy;
  delete queryParams.sortOrder;

  // Добавляем оставшиеся параметры в фильтр
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key]) {
      filter[key] = queryParams[key];
    }
  });

  return filter;
};

export const formatPaginationQuery = (
  baseUrl: string,
  options: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: string;
    filters?: { [key: string]: any };
  }
): string => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', options.page.toString());
  queryParams.append('limit', options.limit.toString());

  if (options.sortBy) {
    queryParams.append('sortBy', options.sortBy);
  }

  if (options.sortOrder) {
    queryParams.append('sortOrder', options.sortOrder);
  }

  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value.toString());
      }
    });
  }

  return `${baseUrl}?${queryParams.toString()}`;
}; 