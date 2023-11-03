# Apprendre à créer une API Rest avec NestJS et PostgreSQL

## Introduction

NestJS est un framework Node.js progressif permettant de créer des applications côté serveur efficaces, fiables et évolutives.

NestJS combine la POO (Programmation Objet Orienté), la FP (Programmation Fonctionnelle) et la FRP (Programmation Réactive Fonctionnelle).

NestJS utilise la bibliothèque Express, donc chaque technique d'utilisation du modèle MVC (Model-View-Controller) dans Express s'applique également à NestJS.

## Conditions préalables

Node.js (>= 10.13.0) doit être installé.

Pour savoir si Node est installé et/ou connaître la version actuellement, il suffit d'utiliser la commande `node -v ` dans un terminal.

## Installation

Pour commencer un projet avec Nest, il est possible de l'initialiser soit en installant la Nest CLI, soit en clonant un projet de démarrage (les deux produiront le même résultat).

La documentation officielle est disponible [ici](https://docs.nestjs.com/#installation)

Pour cet apprentissage, j'utiliserai Nest CLI. Il s'agit d'un outil d'interface de ligne de commande qui m'aidera à créer, maintenir et déplolyer mes applications Nest.

Commençons par installer Nest CLI dans mon envirronement de développement (j'utiliserai le gestionnaire de paquet [pnpm](https://pnpm.io) lors de cet apprentissage mais npm ou yarn peuvent également faire le travail. Il suffira de modifier `pnpm` par `npm`dans les commandes du terminal).

```bash
pnpm i -g @nestjs/cli
```

Pour initialiser le projet avec NestJs :

```bash
nest new project-name # Cette commande va créer un nouveau répertoire avec la configuration de base
cd project-name
pnpm install # Cette commande va installer les dépendances
pnpm run start:dev # Cette commande va démarrer un serveur de développement en mode "--watch"
```

## Description de l'architecture de base

L'architecture de Nest est basée sur des modules. Un module est un conteneur logique pour un ensemble de composants liés (par exemple, des contrôleurs, des services et des fournisseurs).

- le fichier app.controller.ts est responsable de la gestion des requêtes HTTP entrantes et de la renvoi des réponses au client.

- le fichier app.service.ts est responsable de la gestion des données.

- le fichier app.module.ts est responsable de l'importation des modules et de la gestion des dépendances.

- le fichier main.ts est responsable de l'initialisation de l'application.

## Création d'un premier module : users

Pour créer un module, il suffit d'utiliser la commande suivante :

```bash
nest g module users
```

Cette commande va créer un nouveau répertoire avec la configuration de base. Dans ce répertoire, on retrouve un fichier `users.module.ts` qui contient la configuration de base du module.

## Création d'un premier controller : users

### Création du controller

Pour créer un controller, il suffit d'utiliser la commande suivante :

```bash
nest g controller users
```

La commande crée un fichier `users.controller.ts` dans le répertoire users de notre entité et ajoute ce controlleur dans le module `users.module.ts`.

Un contrôleur est une classe simple avec le décorateur `@Controller('users')` qui est nécessaire pour définir un contrôleur et spécifie le préfixe utilisateur. Cela permet de regrouper facilement un ensemble de routes associées et de minimiser le code répétitif.

Pour gérer les différentes méthodes, NestJS nous fournit les méthodes : @Get, @Post, @Put(), @Delete(), @Patch()et il existe un autre décorateur qui les gère toutes @All().

### Ajout d'une route GET et d'une route POST

```typescript
// users.controller.ts
import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(): string {
    return 'This action returns all users';
  }

  @Post()
  create(): string {
    return 'This action adds a new user';
  }
}
```

> A ce stade, il est déjà possible de tester les routes GET et POST de l'API avec Postman, Insomnia ou tout autre outil de test d'API (ex. l'extension Thunder Client de VSCode).

## Création d'un premier service : users

Pour créer un service, il suffit d'utiliser la commande suivante :

```bash
nest g service users
```

La commande crée un fichier `users.service.ts` dans le répertoire users de notre entité et ajoute ce service dans le module `users.module.ts`.

Un service est une classe simple avec le décorateur `@Injectable()` qui est nécessaire pour définir un service. Un service est généralement injecté dans un contrôleur ou un autre service à l'aide de l'injection de dépendance.

Un service est un concept fondamental dans Nest, il permet :

- d'organiser le code,
- de partager la logique entre les contrôleurs,
- de garder un état partagé entre les contrôleurs,
- de séparer les préoccupations et d'améliorer la modularité,
- de gérer les dépendances externes.

## Création d'un DTO (Data Transfer Object) : users

Un DTO est un objet qui définit comment les données seront envoyées sur le réseau. Il est utilisé pour définir la forme et la validité des données envoyées par les clients à l'API.

### Création du DTO

Nous allons créer un fichier `userDto.ts` dans un répertoire nommé `dto` dans le dossier `users`.

```typescript
// userDto.ts
export class UserDto {}
```

Il est nécessaire de définir les propriétés de l'objet dans le DTO. Pour cela, il faut utiliser les décorateurs de la librairie [class-validator](https://docs.nestjs.com/pipes#class-validator). Ces décorateurs permettent de valider les données envoyées par les clients à l'API.

### Instalation de la librairie class-validator et class-transformer

```bash
pnpm i class-validator class-transformer
```

### Utilisation des décorateurs

```typescript
// userDto.ts
import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  readonly password: string;
}
```

### Ajout de la validation dans le service

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/userDto';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [];

  create(user: UserDto): UserDto {
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }
}
```

### Ajout de la validation dans le controller

```typescript
// users.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/userDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() user: UserDto) {
    return this.usersService.create(user);
  }
}
```

### Ajout de l'auto-validation du ValidationPipe dans le main.ts

https://docs.nestjs.com/techniques/validation#auto-validation

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

## Création et configuration d'une base de données PostgreSQL

NestJs permet d'intégrer facilement n'importe quelle base de données SQL ou NoSQL. Il propose une intégration TypeORM, Sequelize, Mongoose, Prisma, etc. en chargeant simplement le pilote Node.js approprié.

Dans le cas de cet apprentissage, j'utiliserai [TypeORM](https://typeorm.io/) qui est un ORM (Object Relational Mapper) qui permet de manipuler des données relationnelles avec un langage de programmation orienté objet et une base de données PostgreSQL qui sera installée en local dans un conteneur Docker.

> Installation de TypeORM et du pilote PostgreSQL :

```bash
pnpm i @nestjs/typeorm typeorm pg
```

> Installation de dotenv pour la gestion des variables d'environnement et de @nestjs/config pour la configuration de l'application :

```bash
pnpm i dotenv @nestjs/config
```

> Création d'un fichier .env à la racine du projet et ajout des variables d'environnement (pour la prise en charge des variables communes au fichier docker-compose, il est important de le nommer .env):

```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nestjs
```

> Ajout de la configuration de l'application dans le fichier `app.module.ts` :

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
```

> Création d'un fichier docker compose à la racine du projet qui utilise nos variables d'environnement pour la base de données PostgreSQL :

```yaml
# docker-compose.yml
version: '3.9'

services:
  postgres:
    image: postgres:14-alpine
    container_name: postgres
    restart: always
    ports:
      - ${DB_PORT}:5432
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
```

## Création d'une entité : users

Une entité est un objet qui représente une table de la base de données. Une entité est une classe simple avec le décorateur `@Entity()` qui est nécessaire pour définir une entité.

### Création de l'entité

Nous allons créer un fichier `user.entity.ts` dans un répertoire nommé `entity` dans le dossier `users`.

```typescript
// user.entity.ts
import { Entity } from 'typeorm';

@Entity()
export class User {}
```

### Ajout des propriétés de l'entité

```typescript
// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  readonly username: string;

  @Column({
    unique: true,
  })
  readonly email: string;

  @Column()
  readonly password: string;
}
```

### Ajout de l'entité dans le module

```typescript
// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

### Ajout de l'entité dans le service

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserDto } from './dto/userDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(user: UserDto): Promise<string> {
    try {
      await this.userRepository.save(user);
      return 'User created successfully';
    } catch (err) {
      console.log(err);
    }
  }
}
```

### Ajout de l'entité dans le controller

```typescript
// users.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/userDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Post('/')
  async create(@Body() user: UserDto) {
    return await this.usersService.create(user);
  }
}
```

## En résumé

Pour gérer les utilisateurs, nous avons :

- créé un module `users` avec la commande `nest g module users`,
- créé un controller `users` avec la commande `nest g controller users`,
- créé un service `users` avec la commande `nest g service users`,
- créé un DTO `userDto` avec les décorateurs de la librairie `class-validator`,
- créé une entité `user` avec le décorateur `@Entity()` de `typeorm`,
- ajouté l'entité `user` dans le module `users`,
- ajouté l'entité `user` dans le service `users`,
- ajouté l'entité `user` dans le controller `users`.

## Glossaire :

### Les modules

Un module est un conteneur logique pour un ensemble de composants liés (par exemple, des contrôleurs, des services et des fournisseurs). Il est possible de créer un module personnalisé en implémentant la classe `Module` de `@nestjs/common`.

### Les controllers

Un controller est un mécanisme permettant de gérer les requêtes HTTP entrantes et de renvoyer les réponses au client. Il est possible de créer un controller personnalisé en utilisant le décorateur `@Controller()` de `@nestjs/common`.

### Les services

Un service est un mecanisme permettant de gérer la logique métier. Il est possible de créer un service personnalisé en utilisant le décorateur `@Injectable()` de `@nestjs/common`.

### Les DTOs

Un DTO est un objet qui définit comment les données seront envoyées sur le réseau. Il est possible de créer un DTO personnalisé en utilisant le décorateur `@IsString()` de `class-validator`.

### Les entités

Une entité est un objet qui représente une table de la base de données. Il est possible de créer une entité personnalisée en utilisant le décorateur `@Entity()` de `typeorm`.

### Les repositories

Un repository est un mécanisme permettant de gérer les requêtes SQL. Il est possible de créer un repository personnalisé en utilisant le décorateur `@InjectRepository()` de `@nestjs/typeorm`.

### Les décorateurs

Un décorateur est une fonction qui peut être utilisée pour annoter une classe, une propriété, une méthode ou un paramètre de méthode. Les décorateurs sont une fonctionnalité expérimentale qui peut être activée en ajoutant l'option `experimentalDecorators` à `tsconfig.json`.

### Les pipes

Un pipe est un mécanisme permettant de transformer les données avant qu'elles n'atteignent le contrôleur. Il est possible de créer un pipe personnalisé en implémentant la classe `PipeTransform` de `@nestjs/common`.

### Les guards

Un guard est un mécanisme permettant de contrôler l'accès à une ressource. Il est possible de créer un guard personnalisé en implémentant la classe `CanActivate` de `@nestjs/common`.

### Les intercepteurs

Un intercepteur est un mécanisme permettant d'intercepter la requête avant qu'elle n'atteigne le contrôleur et la réponse avant qu'elle ne soit renvoyée au client. Il est possible de créer un intercepteur personnalisé en implémentant la classe `NestInterceptor` de `@nestjs/common`.

### Les middlewares

Un middleware est un mécanisme permettant de traiter la requête avant qu'elle n'atteigne le contrôleur et la réponse avant qu'elle ne soit renvoyée au client. Il est possible de créer un middleware personnalisé en implémentant la classe `NestMiddleware` de `@nestjs/common`.

### Les exceptions

Une exception est un mécanisme permettant de gérer les erreurs. Il est possible de créer une exception personnalisée en étendant la classe `HttpException` de `@nestjs/common`.

### Les filtres

Un filtre est un mécanisme permettant de transformer la réponse avant qu'elle ne soit renvoyée au client. Il est possible de créer un filtre personnalisé en implémentant la classe `ExceptionFilter` de `@nestjs/common`.

### Les providers

Un provider est un mécanisme permettant de créer une instance d'une classe et de l'injecter dans un contrôleur ou un autre service. Il est possible de créer un provider personnalisé en utilisant le décorateur `@Injectable()` de `@nestjs/common`.
