// src/interfaces/ControllerInterface.ts
export interface ControllerInterface<T> {
  getAll(name: string, page: number): Promise<T[]>;

  getById({ id }: { id: string }): Promise<T>;

  getByEmail({ email }: { email: string }): Promise<T>;

  getByName({ name }: { name: string }): Promise<T[]>;

  getByDni({ dni }: { dni: string }): Promise<T>;

  create({ data }: { data: T }): Promise<T>;

  update({ id, data }: { id: string; data: T }): Promise<T>;

  delete({ id }: { id: string }): Promise<{ success: boolean }>;
}
