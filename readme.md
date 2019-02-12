# IoT FabLab Order Management

## Requirements

* Node > 10.6
* MongoDB (or at least a server with it)
	* Locally:
	```bash
	docker run --rm -d \
	--name order-mongo \
	-e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
	-e MONGO_INITDB_ROOT_PASSWORD=veryInsecurePW \
	-v /path/to/git/order-management/dev-mongo:/data/db \
	mongo
	```
	* Server:
	`ssh -L 27017:localhost:27017 remote-user@212.83.56.107`
* Webserver (Nginx, Apache) for production (Let's Encrypt for Certificate)
* PM2

### Setup

* Install Node
* Install Mongo
* Install PM2 via npm
* Install a Webserver with SSL Certificate
* Check Configuration of this project (order-management/api/config/config.ts for backend and order-management/frontend/app/config/routes.ts for frontend)

## Use Node-Debugger with VSCode

If you use this boilerplate with VSCode you can run the debugger for node with ```npm run api-dev``` and use the feature in the bottom line 'auto attach' when running 'Attach to NPM'. This auto attaches the debugger to the running npm process.

## Run the app

To run the app in dev mode you need to run ```npm run api-dev``` and ```npm run ng-dev```. The application will then run on localhost:4200 for the angular app and localhost:3000 for the node backend. These commands will rebuild the nodets and ng application on changed files. **Beaware that the backend server only starts when a debugger is attached to it**.

### Admin User

You can login to the initial admin user with *username:* **admin** and *password:* **E9bBs8UpeASq**