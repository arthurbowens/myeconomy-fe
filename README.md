# PassGenerator Mobile

Aplicativo mobile para geração e gerenciamento de senhas seguras.

## Requisitos

- Node.js versão 18.x ou superior
- npm (Node Package Manager) versão 9.x ou superior
- Expo CLI instalado globalmente
- Android Studio (para desenvolvimento Android)

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd passGenerator-mobile
```

2. Instale as dependências:
```bash
npm install
```

## Executando o Projeto

Para iniciar o projeto em modo de desenvolvimento:

```bash
npm start
```

Após executar o comando acima, você terá as seguintes opções:
- Pressione `a` para abrir no Android
- Pressione `w` para abrir na web
- Escaneie o QR Code com o aplicativo Expo Go no seu dispositivo móvel

## Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run android` - Inicia o aplicativo no Android
- `npm run web` - Inicia o aplicativo na web

## Estrutura do Projeto

```
passGenerator-mobile/
├── src/              # Código fonte do aplicativo
├── assets/           # Recursos estáticos (imagens, fontes, etc.)
├── App.js           # Componente principal
└── package.json     # Dependências e scripts
```

## Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- React Navigation
- Axios
- AsyncStorage
- Expo Secure Store

## Observações

- Certifique-se de ter o ambiente de desenvolvimento configurado corretamente para React Native/Expo
- Para desenvolvimento em Android, certifique-se de ter o Android Studio instalado e configurado
- Caso encontre algum erro relacionado ao toast message, execute: `npm install react-native-toast-message`
# myeconomy
# myeconomy-fe
