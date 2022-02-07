# networthcalculator

This is the web client and server application demo. This application is designed to be simple calculator where user can modify the row or change the currency and get immediate calculation.

The project contains two part web client frontend and web service backend. The webclient frontend is implemented using nextjs and chakra. The backend service is used nestjs framework. In addition to the NestJs framework, I also use the third party service to get exchange rate. [ExchangeAPI](https://app.exchangerate-api.com/)

## Prerequisite

1. node
2. nestjs
3. nextjs

## Running Locally.

Webclient
```
cd webclient
yarn 
yarn dev
```

Service

you would need to sign up for [ExchangeRate](https://app.exchangerate-api.com/) to get api key. create .env file and create variable 
CURRENCY_API=https://v6.exchangerate-api.com/v6/YOURAPIKEY/latest/
```
cd service
yarn start:dev
```

The service need to run on port 3001 before the webclient start.

