
const UserApi = require('../api/user');
const UserController = require('../controllers/user');
 
jest.mock('../controllers/user', () => ({
  createUser: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  login: jest.fn(),
  validateToken: jest.fn(),
}));
 
describe('UserApi', () => {
  let req, res, next;
 
  beforeEach(() => {
    req = {
      body: {},
      params: {},
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      cookie: jest.fn(),
    };
    next = jest.fn();
  });
 
  describe('createUser', () => {
    it('deve criar um novo usuário', async () => {
      req.body = {
        nome: 'felpszin',
        email: 'felps@example.com',
        senha: 'felp123',
      };
 
      UserController.createUser.mockResolvedVxalue({ id: 1, nome: 'felpszin', email: 'felps@example.com' });
 
      await UserApi.createUser(req, res);
 
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ id: 1, nome: 'felpszin', email: 'felps@example.com' });
    });
 
    it('deve lidar com erros durante a criação do usuário', async () => {
      req.body = {
        nome: 'felpszin',
        email: 'felps@example.com',
        senha: 'felpzin1234',
      };
 
      UserController.createUser.mockRejectedValue(new Error('Erro ao criar usuário Database erro de conexão'));
 
      await UserApi.createUser(req, res);
 
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Erro ao criar usuário Database erro de conexão' });
    });
  });
 
  describe('updateUser', () => {
    it('deve atualizar um usuário existente', async () => {
      req.params.id = '1';
      req.body = {
        nome: 'novo Nome',
        email: 'novo.email@example.com',
        senha: 'novasenha',
      };
 
      UserController.update.mockResolvedValue({ id: 1, nome: 'novo Nome', email: 'nome.email@example.com' });
 
      await UserApi.updateUser(req, res);
 
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ id: 1, nome: 'novo Nome', email: 'nome.email@example.com' });
    });
 
    it('deve lidar com erros durante a atualização do usuário', async () => {
      req.params.id = '1';
      req.body = {
        nome: 'Nome',
        email: 'nome.email@example.com',
        senha: 'newpassword',
      };
 
      UserController.update.mockRejectedValue(new Error('Erro ao alterar usuário Usuário não encontrado'));
 
      await UserApi.updateUser(req, res);
 
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Erro ao alterar usuário Usuário não encontrado' });
    });
  });
 
 
 
});