const {user} = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const SECRET_KEY = 'provaj'
const SALT_VALUE = 10

class UserController {
    async createUser(nome, email, senha) {
        if (nome === undefined || email === undefined || senha === undefined) {
            throw new Error('todos os campos são obrigatorios')
        }

        const provaja = await bcrypt.hash(senha, SALT_VALUE)
       
        const userValue = await user.create({
            nome,
            email,
            senha:  provaja
        })

        return userValue
    }

    async findUser(id) {
        if (id === undefined) {
            throw new Error('Id é obrigatório.')
        }

        const userValue = await user.findByPk(id)
        
        if (!userValue) {
            throw new Error('Usuário não encontrado.')
        }

        return userValue
    }

    async update(id, nome, email, senha) {
        if (id === undefined || nome === undefined || email === undefined || senha === undefined) {
            throw new Error('todos os campos são obrigatorios')
        }

        const userValue = await this.findUser(id)

        userValue.nome = nome
        userValue.email = email
        userValue.senha = await bcrypt.hash(senha, SALT_VALUE)
        userValue.save()

        return userValue
    }

    async delete(id) {
        if (id === undefined) {
            throw new Error('Id é obrigatório.')
        }
        const userValue = await this.findUser(id)
        userValue.destroy()

        return
    }

    async find() {
        return user.findAll()
    }

    async login(email, senha,test) {

        if(test==1){
            if (email === undefined || senha === undefined) {
                throw new Error('Email e senha são obrigatórios.')
            }
    
            const userValue = await user.findOne({ where: { email }})
    
            if (!userValue) {
                throw new Error(' Usuário e senha inválidos.')
            }
    
            const senhaValida = bcrypt.comparar(senha, userValue.senha) 
            if (!senhaValida) {
                throw new Error(' Usuário e senha inválidos.')
            }
            return userValue.id
        }
        if (email === undefined || senha === undefined) {
            throw new Error('Email e senha são obrigatórios.')
        }

        const userValue = await user.findOne({ where: { email }})

        if (!userValue) {
            throw new Error(' Usuário e senha inválidos.')
        }

        const senhaValida = bcrypt.comparar(senha, userValue.senha) 
        if (!senhaValida) {
            throw new Error(' Usuário e senha inválidos.')
        }
        
        return jwt.sign({ id: userValue.id }, SECRET_KEY, { expiresIn: 60 * 60 })
    }

    async validateToken(token) {
        if (!token) {
            throw new Error('Token inválido')
        }

        try {
            await jwt.verify(token, SECRET_KEY)
        } catch {
            throw new Error('Token inválido')
        }
    }
} 

module.exports = new UserController()