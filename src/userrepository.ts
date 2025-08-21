// UserRepository.ts
import { ICliente } from './server';

export interface IUserRepository {
  findAll(): Promise<ICliente[]>;
  findByCPF(cpf: string): Promise<ICliente | null>;
  create(cliente: ICliente): Promise<void>;
  update(cpf: string, cliente: ICliente): Promise<void>;
  delete(cpf: string): Promise<void>;
}
