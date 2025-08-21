
import express from 'express';
import { Request, Response, NextFunction} from 'express';
import 'dotenv/config.js';
import { Interface } from 'readline';
import { ErrorRequestHandler } from 'express';
import 'dotenv/config';
import { AppError } from './errors/AppError';
import { IUserRepository } from './userrepository';
import { UserRepositoryFile } from './UserRepositoryFile'; // ou UserRepositoryMemory, UserRepositoryNedb

const app = express();
app.use(express.json());

const userRepository: IUserRepository = new UserRepositoryFile(); // ou Memory, Nedb



const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }
  
    console.error(err);
  
    return res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor',
    });
  };
  
  app.use(errorHandler);
  

const clientMiddleware = (req: Request, res: Response,  next: NextFunction): void => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
};

app.use(clientMiddleware);

interface IPessoa {
    CPF: string;
    Nome: string;
    RG: string;
}

interface IEndereco {
    CEP: string;
    Rua: string;
    Bairro: string;
    Cidade: string;
    Estado: string;
}

export interface ICliente extends IPessoa, IEndereco {
    Email: string;
}

// // Criação do array de clientes
// let clientes: ICliente [] = [];

// const novoCliente: ICliente ={
//     CPF: '123.456.789-00',
//     Nome: 'Maria Joana',
//     RG: '12.345.678-9',
//     CEP: '12345-678',
//     Rua: 'Rua Principal',
//     Bairro: 'Centro',
//     Cidade: 'Minha Cidade',
//     Estado: 'SP',
//     Email: 'maria@exemplo.com'
// }

// // Adicionando o novo cliente ao array
// clientes.push(novoCliente);

// console.log(clientes);

// app.get('/clientes', (req: Request, res: Response) => {
//     // Retorna o array de clientes como uma resposta JSON
//     return res.json({ clientes: clientes });
//   });

// // app.get('/clientes/:cpf', (req: Request, res: Response) => {
// //     const cpfParam = req.params.cpf;
    
// //     // Busca o cliente no array que tem o CPF correspondente
// //     const clienteEncontrado = clientes.find(cliente => cliente.CPF === cpfParam);
  
// //     // Se o cliente for encontrado, retorna-o
// //     if (clienteEncontrado) {
// //       return res.json(clienteEncontrado);
// //     }
  
// //     // Se o cliente não for encontrado, retorna um erro 404
// //     return res.status(404).json({ mensagem: 'Cliente não encontrado' });
// //   });

// app.get('/clientes/:cpf', (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const cpfParam = req.params.cpf;
//         const clienteEncontrado = clientes.find(cliente => cliente.CPF === cpfParam);

//         if (!clienteEncontrado) {
//             throw new AppError('Cliente não encontrado', 404);
//         }   

//         return res.json(clienteEncontrado);
//     } catch (error) {
//         next(error); // passa o erro para o middleware global
//     }
// });


// app.post('/clientes', (req: Request, res: Response) => {
//     const novoCliente: ICliente = req.body;
//      // 2. Verifica se o cliente já existe
//   const clienteExistente = clientes.find(cliente => cliente.CPF === novoCliente.CPF);
//   if (clienteExistente) {
//     return res.status(409).json({ mensagem: 'Cliente com este CPF já cadastrado.' });
//   }
//   // 3. Se a validação passar, adiciona o cliente ao array
//   clientes.push(novoCliente)

//   // 4. Retorna a resposta de sucesso com o novo cliente
//   return res.status(201).json(novoCliente);
// });

// // Rota DELETE para excluir um cliente por CPF
// app.delete('/clientes/:cpf', (req: Request, res: Response) => {
//     const cpfParam = req.params.cpf;

//     // Encontra o índice do cliente no array que tem o CPF correspondente
//     const clienteIndex = clientes.findIndex(cliente => cliente.CPF === cpfParam);

//     // Se o cliente for encontrado (índice diferente de -1)
//     if (clienteIndex > -1) {
//         // Remove o cliente do array
//         clientes.splice(clienteIndex, 1);
        
//         return res.status(200).json({ message: 'Cliente excluído com sucesso' });
//     }
    
//     // Se o cliente não for encontrado, retorna um erro 404
//     return res.status(404).json({ message: 'Cliente não encontrado' });
// });

// // Rota PUT para atualizar um cliente por CPF
// app.put('/clientes/:cpf', (req: Request, res: Response) => {
//     const cpfParam = req.params.cpf;
//     const clienteAtualizado: ICliente = req.body;

//     // Encontra o índice do cliente a ser atualizado
//     const clienteIndex = clientes.findIndex(cliente => cliente.CPF === cpfParam);

//     // Se o cliente não for encontrado, retorna um erro 404
//     if (clienteIndex === -1) {
//         return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
//     }

//     // Opcional: Validação para garantir que o CPF do corpo da requisição não é diferente do CPF da URL
//     if (clienteAtualizado.CPF !== cpfParam) {
//         return res.status(400).json({ mensagem: 'O CPF no corpo da requisição deve ser o mesmo que o da URL.' });
//     }

//     // Atualiza o cliente no array
//     clientes[clienteIndex] = clienteAtualizado;

//     // Retorna o cliente atualizado com status 200 OK
//     return res.status(200).json(clientes[clienteIndex]);
// });
app.get('/clientes', async (req, res, next) => {
    try {
      const clientes = await userRepository.findAll();
      res.json({ clientes });
    } catch (err) {
      next(err);
    }
  });
  
  app.get('/clientes/:cpf', async (req, res, next) => {
    try {
      const cliente = await userRepository.findByCPF(req.params.cpf);
      if (!cliente) throw new AppError('Cliente não encontrado', 404);
      res.json(cliente);
    } catch (err) {
      next(err);
    }
  });
  
  app.post('/clientes', async (req, res, next) => {
    try {
      const novoCliente = req.body;
      const clienteExistente = await userRepository.findByCPF(novoCliente.CPF);
      if (clienteExistente) {
        throw new AppError('Cliente com este CPF já cadastrado.', 409);
      }
      await userRepository.create(novoCliente);
      res.status(201).json(novoCliente);
    } catch (err) {
      next(err);
    }
  });
  
  app.put('/clientes/:cpf', async (req, res, next) => {
    try {
      const cpfParam = req.params.cpf;
      const clienteAtualizado = req.body;
  
      if (clienteAtualizado.CPF !== cpfParam) {
        throw new AppError('O CPF no corpo da requisição deve ser o mesmo que o da URL.', 400);
      }
  
      await userRepository.update(cpfParam, clienteAtualizado);
      res.json(clienteAtualizado);
    } catch (err) {
      next(err);
    }
  });
  
  app.delete('/clientes/:cpf', async (req, res, next) => {
    try {
      await userRepository.delete(req.params.cpf);
      res.json({ message: 'Cliente excluído com sucesso' });
    } catch (err) {
      next(err);
    }
  });
  
  // Middleware global de erro (deixe como já tem)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ status: 'error', message: err.message });
    }
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Erro interno do servidor' });
  });
  
  app.listen(process.env.API_PORT, () => {
    console.log(`API iniciada na porta ${process.env.API_PORT}`);
  });
  

app.listen(process.env.API_PORT, () => {
    console.log(`Api iniciada na porta: ${process.env.API_PORT}`);
});

// Middleware global de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }   

    console.error('Erro inesperado:', err);
    

    return res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor',
    });
});
