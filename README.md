# Lumina

Um catálogo interativo full-stack que permite buscar, cadastrar e organizar **livros e filmes**. O projeto utiliza uma interface em **HTML, CSS e JavaScript puro** e um backend em **Node.js com Express** para persistir os dados em um banco de dados MongoDB.

Com a nova arquitetura, os utilizadores podem favoritar itens, criar coleções personalizadas e ter todos os seus dados salvos de forma centralizada, acessíveis a partir de qualquer dispositivo.

-----

## Arquitetura

O projeto é dividido em duas partes principais:

  * **Frontend (Cliente):** Uma aplicação de página única (SPA) construída com JavaScript puro que consome a API do backend. É responsável por toda a interface e interação com o utilizador.
  * **Backend (Servidor):** Uma API RESTful construída com Node.js e Express. É responsável por:
      * Intermediar as chamadas para as APIs externas (Google Books e OMDb) de forma segura.
      * Gerir a lógica de negócio.
      * Conectar-se e realizar operações (CRUD) no banco de dados MongoDB para persistir os dados dos utilizadores.

-----

## Funcionalidades

  - Buscar **livros** na API do [Google Books](https://developers.google.com/books) (através do backend).
  - Buscar **filmes** na API do [OMDb](https://www.omdbapi.com/) (através do backend).
  - Cadastrar itens manualmente (com formulário).
  - Exibir resultados em **cards responsivos**.
  - **Favoritar** e **desfavoritar** itens.
  - Persistência de dados em banco de dados **MongoDB**.
  - Importar e exportar dados em formato JSON.
  - Suporte a **tema claro/escuro**.

-----

## Tecnologias Utilizadas

### Frontend

  - **HTML5**
  - **CSS3** (Flexbox, Grid, variáveis para temas)
  - **JavaScript (ES6+)**

### Backend

  - **Node.js**
  - **Express.js**
  - **MongoDB** (com **Mongoose** para modelagem de dados)
  - **dotenv** (para gestão de variáveis de ambiente)
  - **axios** (para chamadas às APIs externas)

-----

## Como Executar o Projeto

### Pré-requisitos

Antes de começar, garanta que tem instalado:

  - [Node.js](https://nodejs.org/) (que inclui o npm)
  - [MongoDB](https://www.mongodb.com/try/download/community) (ou uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1\. Configuração do Backend

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/Nayana-Oliveira/Lumina.git
    cd Lumina
    ```

2.  **Navegue até a pasta do backend e instale as dependências:**

    ```bash
    cd backend
    npm install
    ```

3.  **Crie e configure o ficheiro de ambiente:**

      * Crie um ficheiro chamado `.env` na raiz da pasta `backend/`.
      * Copie e cole o conteúdo abaixo, substituindo os valores necessários:
        ```env
        # Chave da API do OMDb
        OMDB_API_KEY=sua_chave_aqui

        # String de conexão do MongoDB (escolha uma)
        # Para banco de dados local:
        MONGO_URI=mongodb://localhost:27017/lumina
        # Para MongoDB Atlas na nuvem:
        # MONGO_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/lumina

        # Porta do servidor
        PORT=3000
        ```

4.  **Inicie o servidor do backend:**

    ```bash
    node server.js
    ```

    O seu terminal deverá mostrar "Servidor rodando na porta 3000" e "Conectado ao MongoDB com sucesso\!".

### 2\. Configuração do Frontend

1.  **Abra um novo terminal** e navegue de volta para a pasta raiz do projeto.
2.  Abra o ficheiro `index.html` no seu navegador. A forma mais fácil é usar uma extensão como o **Live Server** no VS Code.

A aplicação frontend irá carregar e fazer as chamadas para o seu backend que está a correr em `http://localhost:3000`.

-----

## API Endpoints

O backend expõe os seguintes endpoints:

| Método | Rota                  | Descrição                                         |
| :----- | :-------------------- | :------------------------------------------------ |
| `GET`  | `/api/search`         | Busca por livros e filmes. Query params: `q`, `type`. |
| `GET`  | `/api/favorites`      | Retorna uma lista de todos os itens favoritados.    |
| `POST` | `/api/favorites`      | Adiciona um novo item aos favoritos.              |
| `DELETE`| `/api/favorites/:id`  | Remove um item dos favoritos pelo seu ID.         |

-----

## Licença

Este projeto está sob a licença **MIT**.
Sinta-se livre para usar, modificar e compartilhar.

-----

## Autor

Desenvolvido por [Nayana Heslley Barbosa Oliveira](https://github.com/Nayana-Oliveira)