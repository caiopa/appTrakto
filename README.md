## Seja bem vindo ao App Trakto

O projeto foi desenvolvido em Nest, Nodejs, Typescript, Mongodb

### Orientações para testar

!importante (Ter o DOCKER e NODE instalados)

 1. Clone o repositório ``
 2. Rode o docker compose na raiz do projeto com o comando `docker compose up --build`
  OU rode o docker run com a imagem do mongo `docker run --name mongodb -d -p 27017:27017 mongo:latest`
 3. Configure as variáveis de ambiente se necessário:  MONGODB_DATABASE: `trakto` e conect-se no banco de dados. MONGODB_PORT `27017`

 4. Na raiz pasta raiz do projeto de um `npm install`
 5. Apos rode o `npm run start:dev`

### Modelo de requisição para testar

URL: `${BASE_URL}/image/save`
METHOD: `POST`
BODY: 
```
{
    "image": "https://assets.storage.trakto.io/AkpvCuxXGMf3npYXajyEZ8A2APn2/0e406885-9d03-4c72-bd92-c6411fbe5c49.jpeg",
    "compress": 0.9
}
``` 
OBS: A imagem salva e reduzida estão sendo salva na pasta `.src/assests` exemplo: `./src/assests/original_{...}.jpg` e a reduzida `./src/assests/_thumb_{...}.jpg`


<details>
<summary> Funcionalidades </summary><br/>
 
 1. Conseguir salvar uma imagem recebida por uma URL publica no formato jpg e gerar um versão reduzida (acrescentando o sufixo _thumb ao nome do arquivo)

 2. A imagem reduzida deve ser compactada e o fator deve ser enviado como parâmentro junto com a url da imagem original.

</details><br />

### Test

1. Para rodar o teste de `npm run test:cov `
