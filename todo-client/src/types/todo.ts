export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TodoQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  completed?: boolean | 'all';
  sortBy?: 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTodoPayload {
  title: string;
}

export interface UpdateTodoPayload {
  title?: string;
  completed?: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
