const task = require('../models/task')
const project = require('../models/project')

class TaskController {
    async createTask(titulo, descricao, id_projeto) {
        if (titulo === undefined || 
            descricao === undefined ||
            id_projeto === undefined) {
            throw new Error('todos os campos são obrigatorios')
        }
        const projectValue = await project.findByPk(id_projeto);
        if (!projectValue) {
            throw new Error('Projeto não encontrado.');
        }
        const status = "pendente";
        const taskValue = await task.create({
            titulo,
            descricao,
            status,
            id_projeto
        })

        return taskValue
    }

   

   

    async delete(id) {
        if (id === undefined) {
            throw new Error('o campo Id é obrigatório.')
        }
        const taskValue = await this.findTask(id)
        taskValue.destroy()

        return
    }

    async update(id, titulo, descricao, status, id_projeto) {
        if (id === undefined || 
            titulo === undefined || 
            descricao === undefined || 
            status === undefined || 
            id_projeto === undefined) {
            throw new Error('todos os campos são obrigatorios')
        }

        

        const taskValue = await this.findTask(id)
        const data_conclusao = null
       


        taskValue.titulo = titulo
        taskValue.descricao = descricao
        taskValue.status = status
        taskValue.id_projeto = id_projeto
        taskValue.data_conclusao = data_conclusao
        taskValue.save()

        return taskValue
    }

    async filter(id_projeto,status){
        if (isNaN(id_projeto)) {
            throw new Error('por favor, insira um número inteiro');
        }
        
        if(status){
            return await task.findAll({
                where: {
                id_projeto: id_projeto,
                status: status
                }
            });
        } else {
            return await task.findAll({
                where: {
                    id_projeto: id_projeto
                }
            });
        }
        
    }
    
    async find() {
       
        
        return task.findAll()

       
    }

    

} 

module.exports = new TaskController()