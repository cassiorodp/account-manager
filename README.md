<!--
*** Template adatpet from: https://github.com/othneildrew/Best-README-Template
***
-->

<p align="center">
  <a href="https://github.com/cassiorodp/account-manager" target="_blank">
    <img src="./src/img/pixel-money.gif" alt="Logo" width="120" height="120">
  </a>

  <h2 align="center">Account Manager API</h2>

  <p align="center">
    API online para Code Challenge realizado para vaga de Associate Software Developer na Digital Republic.
    <br />
    <a href="https://account-magager.herokuapp.com/" target="_blank">Source</a>
    ·
    <a href="https://github.com/cassiorodp/account-manager/issues" target="_blank">Report Bug</a>
  </p>
</p>

---

<details open="open">
  <summary><h2">Tabela de Conteúdos</h2></summary>
  <ol>
    <li>
      <a href="#about">Sobre</a>
      <ul>
        <li><a href="#features">Funcionalidades</a></li>
        <li><a href="#techs">Tecnologias</a></li>
      </ul>
    </li>
    <li>
      <span>Executando a aplicação</span>
      <ul>
        <li><a href="#prerequisites">Pré-requisitos</a></li>
        <li><a href="#installation">Instalação</a></li>
      </ul>
    </li>
    <li><a href="#contacts">Contacts</a></li>
  </ol>
</details>

<h2 id="about">⚡ About</h2> 
<p align="center">
Account-Manager é uma API que simula um banco de dados de uma instuição financeira, sendo possível a criação de contas, login, depósito e transfência entre contas.
</p>

<h3 id="features">⚙ Funcionalidades</h3>

- Criação de usuário por meio de seu CPF e nome, além da sua senha
- Validação via JWT(Json Web Token) ao fazer depósito e transferência
- Limitação do valor de depósito(R$2000,00)
- Impossibilidade de transferencia para outra conta caso saldo seja insuficiente

<h3 id="techs">💻 Techs</h3>
  
<div>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="nodejs" width="40" height="40"/> 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mocha/mocha-plain.svg" alt="mocha" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="mongodb" width="40" height="40"/> 
</div>

<h3>👨‍💻 Running the App</h3>

Para executar a API, faça o seguinte:

<h3 id="prerequisites">Prerequisites</h3>

Você precisará ter alguma dessas ferramentas para verificar os retornos da api: [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/).


<h3 id="installation">Instalação</h3>

1. Clone o repositório (HTTPS ou SSH)
   ```sh
   git clone https://github.com/cassiorodp/account-manager
   ```
    
   ```sh
   git@github.com/cassiorodp/account-manager
   ```

2. Acesse o repositório local e instale as dependencias

   ```sh
   npm install
   ```
   
3. Para sua aplicação rodar localmente, é necessario a criação de um arquivo ".env" para serem inseridos as variáveis de ambiente

   ```
   // .env
   PORT=3000
   HOST=localhost
   SECRET=afgweqrtewt34124
   // nesse caso, estamos apenas simulando o 'secret' do token
   ```
4. Após ter definido as variáveis de ambiente, inicie sua aplicação!
   ```sh
   npm start
   ```

---

<h2 id="contacts">📫 Contacts</h2>
    
<h3>Essa API foi feita por:</h3>
<br/>
<ul>
    <li>
      <a href="https://www.linkedin.com/in/cassio-rodrigues-pereira/" target="_blank">
        <img src="https://img.shields.io/badge/-Cassio_Pereira-blue?style=flat&logo=Linkedin&logoColor=white">
      </a>
      <a href="https://github.com/cassiorodp" target="_blank">
        <img src="https://img.shields.io/badge/-Cassio_Pereira-black?style=flat&logo=Github&logoColor=white">
      </a>
    </li>
</ul>

---
