<div align="center">
	<h1>Railroad</h1>
    <a href="https://github.com/Gael-Lopes-Da-Silva/railroad">https://github.com/Gael-Lopes-Da-Silva/railroad</a>
</div>


Description
------------------------------------------------------------------

Railroad is a javascript API to manage train, train stations and tickets. It run with [Express](https://www.npmjs.com/package/express) and [Mongodb](https://en.wikipedia.org/wiki/MongoDB). The documentation is auto generated with [SwaggerJsdoc](https://www.npmjs.com/package/swagger-jsdoc).


Usage
------------------------------------------------------------------

First, you need to download [Nodejs](https://nodejs.org/en) and [Npm](https://www.npmjs.com/) to be able to run the server. You also need to install [Mongodb](https://en.wikipedia.org/wiki/MongoDB) database and be sure that it run in background. After that go into the server root and run the following.

~~~
npm install
npm start
~~~

The server will be launched. You can go to the documentation following [this link](http://localhost:3000/docs).
If you want to launch the unit testing, run the following.

~~~
npm test
~~~

To add a train station you need to provide an image. For that you can follow this tutorial on how to send images throught Postman: [How to upload image to a POST request](https://community.postman.com/t/how-to-upload-images-to-a-post-request/15256/2).


Manualy test the API
------------------------------------------------------------------

First you will need an administrator user. To create one, create a simple user via the /users/register endpoint using valid input. After that, manualy change the `role` field in Mongodb using [Mongosh](https://www.mongodb.com/docs/mongodb-shell/) or [Mongo Compass](https://www.mongodb.com/products/tools/compass).

After that, in the documentation, you will need to go to the /users/login endpoint and click on `Try it out`. In the body add the informations of the newly created admin user. If successfull, you will get a token returned. Copy this token and paste it in the menu that appears when clicking on `Authorize`. After that you will be able to use all the endpoints freely.