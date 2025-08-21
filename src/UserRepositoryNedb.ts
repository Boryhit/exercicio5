// UserRepositoryNedb.ts
import Datastore from 'nedb-promises';
import { IUserRepository } from './userrepository';
import { ICliente } from './server';

export class UserRepositoryNedb implements IUserRepository {
  private db: Datastore<ICliente>;

  constructor() {
    this.db = Datastore.create({ filename: 'clientes.db', autoload: true });
  }

  async findAll(): Promise<ICliente[]> {
    return this.db.find({});
  }

  async findByCPF(cpf: string): Promise<ICliente | null> {
    return this.db.findOne({ CPF: cpf });
  }

  async create(cliente: ICliente): Promise<void> {
    await this.db.insert(cliente);
  }

  async update(cpf: string, clienteAtualizado: ICliente): Promise<void> {
    const numUpdated = await this.db.update({ CPF: cpf }, clienteAtualizado);
    if (numUpdated === 0) throw new Error('Cliente não encontrado');
  }

  async delete(cpf: string): Promise<void> {
    const numRemoved = await this.db.remove({ CPF: cpf }, { multi: false });
    if (numRemoved === 0) throw new Error('Cliente não encontrado');
  }  
}
