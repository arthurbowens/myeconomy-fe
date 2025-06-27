# My Economy Mobile

Aplicativo mobile para controle de despesas mensais e acompanhamento de metas de economia.

## Requisitos

- Node.js 18.x ou superior
- npm (Node Package Manager) 9.x ou superior
- Expo CLI instalado globalmente (`npm i -g expo-cli`)
- Android Studio (para execução/emulação Android)

## Instalação

1. Clone o repositório

```bash
git clone [URL_DO_REPOSITÓRIO]
cd myeconomy-fe
```

2. Instale as dependências

```bash
npm install
```

## Executando o Projeto

Para iniciar o projeto em modo de desenvolvimento utilize:

```bash
npm start
```

Após iniciar, você poderá:

- Pressionar `a` para abrir no emulador/dispositivo Android
- Pressionar `w` para abrir no navegador (modo web)
- Escanear o QR Code com o aplicativo Expo Go

### Scripts Disponíveis

| Comando | Descrição |
| ------- | --------- |
| `npm start` | Inicia o servidor de desenvolvimento (Expo) |
| `npm run android` | Compila e abre o app no emulador Android |
| `npm run web` | Inicia o app no navegador |

## Estrutura do Projeto

```
myeconomy-fe/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos globais (Auth, etc.)
│   ├── hooks/           # Hooks customizados
│   ├── routes/          # Navegação (Stack & Tabs)
│   ├── resources/       # Tipagens e chamadas de API de baixo nível
│   ├── screens/         # Telas da aplicação
│   ├── services/        # Camada de serviços (negócio)
│   └── utils/           # Funções utilitárias
├── assets/              # Imagens e ícones
├── App.tsx              # Entrypoint do React Native
├── app.json             # Configurações do Expo
└── package.json         # Dependências e scripts
```

## Tecnologias Utilizadas

- **React Native** & **Expo**
- **TypeScript**
- **React Navigation** (`@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`)
- **Axios** para requisições HTTP
- **AsyncStorage** para persistência local
- **Expo Secure Store** para armazenar token JWT
- **React Native Picker** (`@react-native-picker/picker`)
- **Expo Linear Gradient** (`expo-linear-gradient`) para efeitos visuais

## Backend

Este aplicativo consome uma API REST (Java/Spring) que deve estar executando localmente em `http://10.0.2.2:8080/myeconomymatutino/` (valor padrão configurado em `src/utils/api.ts`).

Altere a `baseURL` conforme o endereço/porta da sua API.

## Observações

1. Certifique-se de possuir o ambiente de desenvolvimento React Native/Expo configurado (Java JDK, Android SDK, variáveis de ambiente, etc.).  
2. Se for utilizar dispositivo físico, habilite a depuração USB ou use o aplicativo Expo Go.  
3. Caso precise exibir mensagens de toast, instale a biblioteca correspondente:

```bash
npm install react-native-toast-message
```

4. Para limpar o cache do Expo caso enfrente problemas inesperados:

```bash
npm start -c
```
