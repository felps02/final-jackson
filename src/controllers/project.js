const project = require('../models/project')

class ProjectController {
    async createProject(nome, descricao, id_usuario) {
        if (nome === undefined || descricao === undefined || id_usuario === undefined) {
            throw new Error('toods os campos são obrigatorios.'+ nome + descricao +"  :  "+ id_usuario)
        }
        const projectValue = await project.create({
            nome,
            descricao,
            id_usuario
        })

        return projectValue
    }

    async findProject(id) {
        if (id === undefined) {
            throw new Error('Id é obrigatório.')
        }

        const projectValue = await project.findByPk(id)
        
        if (!projectValue) {
            throw new Error('Projeto não encontrado.')
        }

        return projectValue
    }

    async update(id, nome, descricao, id_usuario) {
        if (id === undefined || 
            nome === undefined || 
            descricao === undefined || 
            id_usuario === undefined) {
            throw new Error('todos os campos são obrigatorio')
        }

        const projectValue = await this.findProject(id)
        if(projectValue.id_usuario == id_usuario){ 
            projectValue.nome = nome
            projectValue.descricao = descricao
            projectValue.save()
            
        return projectValue
        }else{
            throw new Error('Usuario invalido.')
        }
    }
    async find() {
        return project.findAll()
    }

    async delete(id) {
        if (id === undefined) {
            throw new Error('Id é obrigatório.')
        }
        const projectValue = await this.findProject(id)
        projectValue.destroy()

        return
    }

    
} 

module.exports = new ProjectController()