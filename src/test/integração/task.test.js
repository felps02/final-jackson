const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const TaskApi = require('../../api/task');
const TaskController = require('../../controllers/task'); // ajuste o caminho conforme necessário

jest.mock('../../controllers/task', () => ({
  createTask: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  getCookie: jest.fn(),
  filter: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.post('/tasks', TaskApi.createTask);
app.put('/tasks/:id', TaskApi.updateTask);
app.delete('/tasks/:id', TaskApi.deleteTask);
app.get('/tasks', TaskApi.findTasks);
app.get('/tasks/filter/:id_projeto', TaskApi.filterTask);

describe('TaskApi', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      headers: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('createTask', () => {
    it('deve criar uma nova tarefa', async () => {
      req.body = {
        titulo: 'Nova Tarefa',
        descricao: 'Descrição da Tarefa',
        id_projeto: 1,
      };

      TaskController.createTask.mockResolvedValue({ id: 1, titulo: 'Nova Tarefa', descricao: 'Descrição da Tarefa', id_projeto: 1 });

      await TaskApi.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ id: 1, titulo: 'Nova Tarefa', descricao: 'Descrição da Tarefa', id_projeto: 1 });
    });

    it('deve lidar com erros durante a criação da tarefa', async () => {
      req.body = {
        titulo: 'Nova Tarefa',
        descricao: 'Descrição da Tarefa',
        id_projeto: 1,
      };

      TaskController.createTask.mockRejectedValue(new Error('Database erro de conexão'));

      await TaskApi.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Erro ao criar  Database erro de conexão' });
    });
  });

  describe('updateTask', () => {
    it('deve atualizar uma tarefa existente', async () => {
      req.params.id = '1';
      req.body = {
        titulo: 'Tarefa Atualizada',
        descricao: 'Descrição Atualizada',
        status: 'Em Progresso',
        id_projeto: 1,
      };

      TaskController.update.mockResolvedValue({ id: 1, titulo: 'Tarefa Atualizada', descricao: 'Descrição Atualizada', status: 'Em Progresso', id_projeto: 1 });

      await TaskApi.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ id: 1, titulo: 'Tarefa Atualizada', descricao: 'Descrição Atualizada', status: 'Em Progresso', id_projeto: 1 });
    });

    it('deve lidar com erros durante a atualização da tarefa', async () => {
      req.params.id = '1';
      req.body = {
        titulo: 'Tarefa Atualizada',
        descricao: 'Descrição Atualizada',
        status: 'Em Progresso',
        id_projeto: 1,
      };

      TaskController.update.mockRejectedValue(new Error('Tarefa não encontrada'));

      await TaskApi.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Erro ao alterar  Tarefa não encontrada' });
    });
  });

  describe('deleteTask', () => {
    it('deve deletar uma tarefa', async () => {
      req.params.id = '1';

      TaskController.delete.mockResolvedValue();

      await TaskApi.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com erros durante a deleção da tarefa', async () => {
      req.params.id = '1';

      TaskController.delete.mockRejectedValue(new Error('Tarefa não encontrada'));

      await TaskApi.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Erro ao deletar  Tarefa não encontrada' });
    });
  });

  describe('findTasks', () => {
    it('deve listar todas as tarefas', async () => {
      TaskController.find.mockResolvedValue([{ id: 1, titulo: 'Tarefa 1', descricao: 'Descrição 1', id_projeto: 1 }]);

      await TaskApi.findTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith([{ id: 1, titulo: 'Tarefa 1', descricao: 'Descrição 1', id_projeto: 1 }]);
    });

    it('deve lidar com erros ao listar as tarefas', async () => {
      TaskController.find.mockRejectedValue(new Error('Erro ao listar tarefas'));

      await TaskApi.findTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Erro ao listar  Erro ao listar tarefas' });
    });
  });

  describe('filterTask', () => {
    it('deve filtrar tarefas por status', async () => {
      req.params.id_projeto = '1';
      req.query.status = 'Em Progresso';

      TaskController.filter.mockResolvedValue([{ id: 1, titulo: 'Tarefa 1', descricao: 'Descrição 1', id_projeto: 1, status: 'Em Progresso' }]);

      await TaskApi.filterTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith([{ id: 1, titulo: 'Tarefa 1', descricao: 'Descrição 1', id_projeto: 1, status: 'Em Progresso' }]);
    });

    it('deve lidar com erros durante o filtro de tarefas', async () => {
      req.params.id_projeto = '1';
      req.query.status = 'Em Progresso';

      TaskController.filter.mockRejectedValue(new Error('Erro ao filtrar tarefas'));

      await TaskApi.filterTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Erro ao filtrar  Erro ao filtrar tarefas' });
    });
  });
});
