# Order Pizza back-end

Simple REST API that allows users to order pizza to an address and create a story order, using Mysql database.
## Technologies

- Express.js
- mysql2
- passport.js
- JWT local strategy
- uuid
- bcrypt

## Running the project

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure databse connection
4. Start the server: `npm start`

## Features

- Storing data about users (login and password hash)
- Storing information about orders placed
- List of currently offered dishes

## Project status

In progress.

## ToDo
- Add order status, snending update via email
- Add admin pannel to adding pizzas or changes current prices
- add a description for each dish

## Sources

### Express.js

Express.js is a minimalist framework for Node.js that allows you to create web applications and APIs. It is one of the most popular Node.js frameworks.

### mysql2

mysql2 is a library for Node.js that allows you to connect to a MySQL database.

### passport.js

Passport.js is an authentication middleware used to authenticate requests. It allows developers to use different strategies for authenticating users, such as using a local database or connecting to social networks through APIs.

### JWT local strategy

JWT (JSON Web Token) is a token-based authentication standard. JWT local strategy is a Passport.js authentication strategy based on JWT tokens.

### uuid

uuid is a library that allows you to generate unique identifiers.

### bcrypt

bcrypt is a library that allows you to hash passwords and compare them during login.

If you need help with your project, let me know!




-- --------------------------------------------------------
## Database structure dump
-- --------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `login_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `login_app`;
-- --------------------------------------------------------
### Dump of the login_app.orders table structure
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `orders` (
`id` varchar(36) NOT NULL DEFAULT uuid(),
`adress` varchar(36) DEFAULT NULL,
`user_id` varchar(36) DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `FK_orders_users` (`user_id`),
CONSTRAINT `FK_orders_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------
### Dump of the login_app.orders_pizzas table structure
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders_pizzas` (
`id` varchar(36) NOT NULL DEFAULT uuid(),
`order_Id` varchar(36) DEFAULT NULL,
`pizzas_Id` varchar(36) DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `FK_orders_pizzas_orders` (`order_Id`),
KEY `FK_orders_pizzas_pizzas` (`pizzas_Id`),
CONSTRAINT `FK_orders_pizzas_orders` FOREIGN KEY (`order_Id`) REFERENCES `orders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
CONSTRAINT `FK_orders_pizzas_pizzas` FOREIGN KEY (`pizzas_Id`) REFERENCES `pizzas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------
## Dump of the login_app.pizzas table structure
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pizzas` (
`id` varchar(36) NOT NULL DEFAULT uuid(),
`name` varchar(36) NOT NULL,
`price` decimal(4,2) unsigned NOT NULL DEFAULT 0.00,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------
## Dump of the login_app.users table structure
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
`id` varchar(36) NOT NULL DEFAULT uuid(),
`name` varchar(36) DEFAULT NULL,
`password` varchar(70) DEFAULT NULL,
`stan_konta` int(11) DEFAULT NULL,
`email` varchar(50) DEFAULT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;