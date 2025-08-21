// UserRepositoryFile.ts
import { promises as fs } from 'fs';
import path from 'path';
import { IUserRepository } from './userrepository';
import { ICliente } from './server';

export class UserRepositoryFile implements IUserRepository {
  private filePath: string;

  constructor(filename = 'clientes.json') {
    this.filePath = path.resolve(__dirname, filename);
  }

  private async readFile(): Promise<ICliente[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data) as ICliente[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return []; // arquivo não existe ainda
      }
      throw error;
    }
  }

  private async writeFile(clientes: ICliente[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(clientes, null, 2));
  }

  async findAll(): Promise<ICliente[]> {
    return this.readFile();
  }

  async findByCPF(cpf: string): Promise<ICliente | null> {
    const clientes = await this.readFile();
    const cliente = clientes.find(c => c.CPF === cpf);
    return cliente || null;
  }

  async create(cliente: ICliente): Promise<void> {
    const clientes = await this.readFile();
    clientes.push(cliente);
    await this.writeFile(clientes);
  }

  async update(cpf: string, clienteAtualizado: ICliente): Promise<void> {
    const clientes = await this.readFile();
    const index = clientes.findIndex(c => c.CPF === cpf);
    if (index === -1) throw new Error('Cliente não encontrado');
    clientes[index] = clienteAtualizado;
    await this.writeFile(clientes);
  }

  async delete(cpf: string): Promise<void> {
    const clientes = await this.readFile();
    const filtered = clientes.filter(c => c.CPF !== cpf);
    await this.writeFile(filtered);
  }
}
