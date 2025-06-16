// src/interfaces/ControllerInterface.ts
export interface ControllerInterface<
  T,
  CreateInput = T,
  UpdateInput = Partial<T>
> {
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

  // Ahora 'create' recibe sólo CreateInput
  create(params: { data: CreateInput }): Promise<T>;

  // 'update' recibe UpdateInput, parcialmente
  update(params: { id: string; data: UpdateInput }): Promise<T>;

  delete(params: { id: string }): Promise<{ success: boolean }>;

  searchByField<K extends keyof T>(params: {
    field: K;
    value: T[K];
  }): Promise<T[]>;
}
