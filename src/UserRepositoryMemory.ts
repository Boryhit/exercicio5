// UserRepositoryMemory.ts
import { IUserRepository } from './userrepository';
import { ICliente } from './server';

export class UserRepositoryMemory implements IUserRepository {
  private clientes: ICliente[] = [];

  async findAll(): Promise<ICliente[]> {
    return this.clientes;
  }

  async findByCPF(cpf: string): Promise<ICliente | null> {
    const cliente = this.clientes.find(c => c.CPF === cpf);
    return cliente || null;
  }

  async create(cliente: ICliente): Promise<void> {
    this.clientes.push(cliente);
  }

  async update(cpf: string, clienteAtualizado: ICliente): Promise<void> {
    const index = this.clientes.findIndex(c => c.CPF === cpf);
    if (index === -1) throw new Error('Cliente não encontrado');
    this.clientes[index] = clienteAtualizado;
  }

  async delete(cpf: string): Promise<void> {
    this.clientes = this.clientes.filter(c => c.CPF !== cpf);
  }
}
