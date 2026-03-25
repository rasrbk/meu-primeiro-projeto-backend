const express = require('express') // inicia o express
const router = express.Router() // aqui configura a primeira parte da rota
const cors = require('cors') //traz o pacote cors que permite consumir essa API no frontend

const conectaBancoDeDados = require('./bancoDeDados')//liga proojeto com o arquivo do banco de dados
conectaBancoDeDados() //chama função que conecta banco de dados

const Mulher = require('./mulherModel')

const app = express() // inicia o app

app.use(express.json())

app.use(cors())

app.use(router)

const porta = 3333 // cria porta

//GET
async function mostraMulheres(request, response) {
    try {
        const mulheresVindasDoBancoDeDados = await Mulher.find()

        response.json(mulheresVindasDoBancoDeDados)

    }catch (erro) {
        console.log(erro)
    }
}

//POST
async function criaMulher(request, response){
    console.log("BODY:", request.body)
    const novaMulher = new Mulher({
        nome: request.body.nome,
        imagem: request.body.imagem, 
        minibio: request.body.minibio,
        citacao: request.body.citacao
    })

    try {
        const mulherCriada = await novaMulher.save()
        response.status(201).json(mulherCriada)
    } catch(erro) {
        console.log(erro)
    }

}

//PATCH
async function corrigeMulher(request, response) {
    console.log('BODY:', request.body)
    try {
        const mulherEncontrada = await Mulher.findById(request.params.id)

        if (request.body.nome) {
            mulherEncontrada.nome = request.body.nome
        }
        if (request.body.minibio) {
            mulherEncontrada.minibio = request.body.minibio
        }
        if (request.body.imagem) {
            mulherEncontrada.imagem = request.body.imagem
        }
        if (request.body.citacao) {
            mulherEncontrada.citacao = request.body.citacao
        }

        const mulherAtualizadaNoBancoDeDados = await mulherEncontrada.save()
        response.json(mulherAtualizadaNoBancoDeDados)

    } catch (erro) {
        console.log(erro)
        response.status(500).json({ erro: 'Erro ao atualizar' })
    }
}

//DELETE
async function deletaMulher(request, response) {
   try {
        await Mulher.findByIdAndDelete(request.params.id)
        response.json({ mensagem: 'Mulher deletada com sucesso'})
   } catch(erro) {
    console.log(erro)
   }
}

router.get('/mulheres', mostraMulheres)
router.post('/mulheres', criaMulher)
router.patch('/mulheres/:id', corrigeMulher)
router.delete('/mulheres/:id', deletaMulher)

//PORTA
function mostraPorta() {
    console.log('Servidor criado e rodando na porta ', porta)
}

app.listen(porta, mostraPorta) //servidor ouvindo a porta