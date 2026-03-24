# App estatico - Bike atual do Rafael

Site estatico de uma pagina para GitHub Pages que mostra:
- Foto da bike atual
- Modelo da bike
- Contador: `Rafael está há X dias sem trocar de bike.`

## Estrutura

- `index.html`: estrutura da pagina
- `styles.css`: estilos
- `app.js`: carrega os dados e calcula os dias
- `data/bike.json`: dados atualizaveis por commit
- `bike.jpeg`: foto atual da bike
- `package.json`: servidor local opcional para desenvolvimento

## Rodar localmente

O `fetch` do `app.js` exige um servidor HTTP (abrir o `index.html` pelo disco nao carrega o JSON). Use um dos modos abaixo.

### Com Node.js (recomendado)

```bash
npm install
npm start
```

Abra [http://localhost:3000](http://localhost:3000). Para outra porta:

```bash
npx serve . -l 8080
```

### Com Python (sem Node)

Na raiz do projeto:

```bash
python -m http.server 8080
```

Abra [http://localhost:8080](http://localhost:8080).

## Como atualizar os dados

1. Substitua a foto em `bike.jpeg` (ou ajuste o caminho em `data/bike.json`).
2. Edite `data/bike.json`:
   - `modelo`: nome/modelo da bike
   - `foto`: caminho relativo da imagem
   - `ultimaTrocaEm`: data da ultima troca no formato `YYYY-MM-DD`
3. Commit e push para o repositorio.

O contador e recalculado automaticamente na abertura da pagina.

## Publicar no GitHub Pages

1. No GitHub, abra `Settings` do repositorio.
2. Em `Pages`, selecione:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main` e pasta `/ (root)`
3. Salve e aguarde a publicacao.

Depois, a URL do site sera exibida na secao do GitHub Pages.
