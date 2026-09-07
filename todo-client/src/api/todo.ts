import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { Todo, TodoQueryParams, CreateTodoPayload, UpdateTodoPayload, PaginationMeta } from '../types/todo';

export interface GetTodosResponse {
  todos: Todo[];
  meta: PaginationMeta;
}

export const todoApi = {
  async getTodos(params: TodoQueryParams = {}): Promise<GetTodosResponse> {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.limit !== undefined) queryParams.set('limit', String(params.limit));
    if (params.search && params.search.trim() !== '') queryParams.set('search', params.search.trim());
    if (params.completed !== undefined && params.completed !== 'all') {
      queryParams.set('completed', String(params.completed));
    }
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = `/api/todos${queryString ? `?${queryString}` : ''}`;

    const res = await apiClient.get<ApiResponse<Todo[]>>(url);
    const pagination = res.data.meta?.pagination || {
      total: res.data.data?.length || 0,
      page: params.page || 1,
      limit: params.limit || 10,
      pages: 1,
    };

    return {
      todos: res.data.data || [],
      meta: pagination,
    };
  },

  async getTodoById(id: number): Promise<Todo> {
    const res = await apiClient.get<ApiResponse<Todo>>(`/api/todos/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.message || 'Todo not found');
    }
    return res.data.data;
  },

  async createTodo(payload: CreateTodoPayload): Promise<Todo> {
    const res = await apiClient.post<ApiResponse<Todo>>('/api/todos', payload);
    if (!res.data.data) {
      throw new Error(res.data.message || 'Failed to create todo');
    }
    return res.data.data;
  },

  async updateTodo(id: number, payload: UpdateTodoPayload): Promise<Todo> {
    const res = await apiClient.patch<ApiResponse<Todo>>(`/api/todos/${id}`, payload);
    if (!res.data.data) {
      throw new Error(res.data.message || 'Failed to update todo');
    }
    return res.data.data;
  },

  async deleteTodo(id: number): Promise<number> {
    const res = await apiClient.delete<ApiResponse<{ id: number }>>(`/api/todos/${id}`);
    return res.data.data?.id ?? id;
  },
};
