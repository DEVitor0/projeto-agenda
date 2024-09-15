const mongoose = require("mongoose");
const validator = require("validator");

// Definição do Schema
const contatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  telefone: { type: String, required: false, default: "" },
  criadoEm: { type: Date, default: Date.now },
});

// Definindo o modelo Mongoose corretamente
const contatoModel = mongoose.model("contato", contatoSchema);

// Função construtora Contato
function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}

// Método de registro
Contato.prototype.register = async function () {
  this.valida();
  if (this.errors.length > 0) return;

  try {
    this.contato = await contatoModel.create(this.body);
  } catch (error) {
    this.errors.push("Erro ao salvar o contato no banco de dados.");
  }
};

// Método de validação
Contato.prototype.valida = function () {
  this.cleanUp();

  // Validação do email
  if (this.body.email && !validator.isEmail(this.body.email)) {
    this.errors.push("E-mail inválido");
  }

  // Validação do campo obrigatório
  if (!this.body.nome) this.errors.push("Nome é um campo obrigatório");

  // Validação de contato: email ou telefone
  if (!this.body.email && !this.body.telefone) {
    this.errors.push(
      "É necessário ao menos um contato para ser enviado: Email ou telefone"
    );
  }
};

// Método de limpeza dos dados
Contato.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }

  // Garantir que apenas os campos necessários sejam mantidos
  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome || "",
    email: this.body.email || "",
    telefone: this.body.telefone || "",
  };
};

module.exports = Contato;
