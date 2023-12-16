const utils = require("../support/utils");

let newName, newEmail, newProductName;
let idUsuario, idProduto;
let authToken;

describe('CRUD usuário spec', () => {
  it('Cadastrar usuário', () => {

    newName = utils.createNewName();
    newEmail = utils.createNewEmail();
    
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        nome: newName,
        email: newEmail,
        password: "123456",
        administrador: "true"
      },
    }).then((resp) => {
      idUsuario = resp.body._id;
      
      expect(resp.status).to.eq(201);
      cy.log(`Usuário cadastrado -> ${resp.body._id} - ${newName} - ${newEmail}`);
      expect(resp.body).to.have.property('message', 'Cadastro realizado com sucesso');
      expect(resp.body).to.have.property('_id');
    })

  });

  it('Buscar usuário e verificar se ele está cadastrado', () => {

    cy.request({
      method: 'GET',
      url: `/usuarios/${idUsuario}`,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.nome).to.equal(newName);
      expect(resp.body.email).to.equal(newEmail);
      expect(resp.body._id).to.equal(idUsuario);
    })

  });

  it('Fazer login', () => {

    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        email: newEmail,
        password: "123456",
      },
    }).then((resp) => {
      authToken = resp.body.authorization;

      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('message', 'Login realizado com sucesso');
      expect(resp.body).to.have.property('authorization');
    })

  });

  it('Cadastrar produto', () => {

    newProductName = utils.createNewName();
    
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": authToken,
      },
      body: {
        nome: newProductName,
        preco: 100,
        descricao: `Descrição do produto ${newProductName}`,
        quantidade: 5
      },
    }).then((resp) => {
      idProduto = resp.body._id;
      
      expect(resp.status).to.eq(201);
      cy.log(`Produto cadastrado -> ${resp.body._id} - ${newProductName}`);
      expect(resp.body).to.have.property('message', 'Cadastro realizado com sucesso');
      expect(resp.body).to.have.property('_id');
    })

  });

  it('Buscar produto e verificar se ele está cadastrado', () => {

    cy.request({
      method: 'GET',
      url: `/produtos/${idProduto}`,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.nome).to.equal(newProductName);
      expect(resp.body._id).to.equal(idProduto);
    })

  });

  it('Atualizar produto por ID', () => {

    cy.request({
      method: 'PUT',
      url: `/produtos/${idProduto}`,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": authToken,
      },
      body: {
        nome: `${newProductName} edited`,
        preco: 100,
        descricao: `Descrição do produto ${newProductName}`,
        quantidade: 5
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('message', 'Registro alterado com sucesso');
    })

  });

  it('Buscar produto e verificar se ele foi atualizado', () => {

    cy.request({
      method: 'GET',
      url: `/produtos/${idProduto}`,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.nome).to.equal(`${newProductName} edited`);
      expect(resp.body._id).to.equal(idProduto);
    })

  });

  it('Excluir produto por ID', () => {

    cy.request({
      method: 'DELETE',
      url: `/produtos/${idProduto}`,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": authToken,
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('message', 'Registro excluído com sucesso');
    })

  });

  it('Buscar produto e verificar que ele não está mais cadastrado', () => {

    cy.request({
      method: 'GET',
      url: `/produtos/${idProduto}`,
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(400);
      expect(resp.body.message).to.equal('Produto não encontrado');
    })

  });

  it('Atualizar Usuário por ID', () => {

    cy.request({
      method: 'PUT',
      url: `/usuarios/${idUsuario}`,
      body: {
        nome: `${newName} edited`,
        email: `edited_${newEmail}`,
        password: "123456",
        administrador: "false"
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('message', 'Registro alterado com sucesso');
    })

  });

  it('Buscar usuário e verificar se ele foi atualizado', () => {

    cy.request({
      method: 'GET',
      url: `/usuarios/${idUsuario}`,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.nome).to.equal(`${newName} edited`);
      expect(resp.body.email).to.equal(`edited_${newEmail}`);
      expect(resp.body.administrador).to.equal('false');
      expect(resp.body._id).to.equal(idUsuario);
    })

  });

  it('Excluir Usuário por ID', () => {

    cy.request({
      method: 'DELETE',
      url: `/usuarios/${idUsuario}`,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('message', 'Registro excluído com sucesso');
    })

  });

  it('Buscar usuário e verificar que ele não está mais cadastrado', () => {

    cy.request({
      method: 'GET',
      url: `/usuarios/${idUsuario}`,
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(400);
      expect(resp.body.message).to.equal('Usuário não encontrado');
    })

  });
  
})