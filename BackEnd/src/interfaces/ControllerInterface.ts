// src/interfaces/ControllerInterface.ts
export interface ControllerInterface<T> {
  getAll(params: {
    name?: string;
    page?: number;
    limit?: number;
    facultad?: string;
    carrera?: string;
  }): Promise<T[]>;
  getById(params: { id: string }): Promise<T>;
  getByEmail(params: { email: string }): Promise<T>;
  getByName(params: {
    name: string;
    page?: number;
    limit?: number;
  }): Promise<T[]>;
  getByDni(params: { dni: string }): Promise<T>;
  create(params: { data: T }): Promise<T>;
  update(params: { id: string; data: Partial<T> }): Promise<T>;
  delete(params: { id: string }): Promise<{ success: boolean }>;
  searchByField<K extends keyof T>(params: {
    field: K;
    value: T[K];
  }): Promise<T[]>;
}
