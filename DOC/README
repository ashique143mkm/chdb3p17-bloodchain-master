=> Bloodchain
-------------

Bloodchain is a helthcare blockchain which is used to store the data of Blood Doners and Recivers, their donate and recive details.


===> Introduction

This is a simple project of a Sawtooth 1.0 application, with a transaction processor and corresponding client. This demonstrates a simple use case, where an blood doner can create blood, acquire available bloods and can view bloods acquired by him. Functionalities provided are:

==> Getting Started
--------------------

The medical field is one of the important field where the data is being given more importance because wrong data or information can harm someone's life.So the data they store are given more importance and are need to be handled more safely. This is the place where the blockchain can help us to solve the problem. The data can be stored and managed using the blockchain technology. That is we can create a blockchain for storing and managing the data of doners and recivers. So that the hospitals and as well as the recivers can verify that the data  is the data that is originated from the orignal place or from a valid person.


===> Prerequisites
------------------

   In order to run the project you need to install,
   ```
	sudo apt-get install npm
	```
	```
	npm install node
	```
	```
	sudo apt-get install docker
	```

===> Running
-------------

To run the project open a terminal in the root folder and run the command given below, this will automatically runn other command inside it.

    ```
    cd /CHDB3P17-BLOODCHAIN
    ```
    ```
    sudo docker-compose up
    ```

this will automatically runns your project.

Login to the validator container using command

	```
	sudo docker exec -it validator bash
	```

using command create a key, you will get a private key nd a public key with the below command

	```
	sawtooth keygen key1
	```
display the key using

	```
	cat /root/.sawtooth/keys/key1.priv
	```
Using this private key you can login to the doner [Dashboard](http://localhost:3000)


===>  Stop
-----------

 To stop the validator and destroy the containers, type `^c` in the docker-compose window, wait for it to stop, then give the command

    ```sudo docker-compose down```


===> Working
------------

1. After running the command sudo docker-compose up go to you web browser and go to [http://localhost:3000](http://localhost:3000) 
here you will get a screen to choose whether you are a createblood(for doners) or a Acuireblood(for recivers) choose for your poupose. Then click [Viewblood](http://localhost:3000/viewblood) then you will get a  window with data is found on the blockchain then the data will be retrieved to you in a table of lists. 


2. When you navigate back to the [root url](http://localhost:3000) you can see another button called [Createblood](http://localhost:3000/createblood) press the button and you can get to a doner details entering page where you need to enter in the inputboxes. When you press the [submit](http://localhost:3000/createblood) you will store a form for adding the details of the doner with thier blood group and the form is only added if there  is correct  sessionstorage key.Complete the form details and press the sumbit donerdetails button then the data will be added to the chain.


3. When you navigate back to the [root url](http://localhost:3000) you can see another button called [Acuireblood](http://localhost:3000/Acuireblood) press the button and you can get to a doner details page where you need someone blood the enter the doner name in input box and press submit. When you press the [submit](http://localhost:3000/Acuireblood) you will get that blood on your registed id and form is only added if there  is correct  sessionstorage key.when you press the sumbit button recivedblood details and blood status data will be added to the chain.


4. After completeing the donate or reciving funtion you can clear the session by using logout buttion this will automatically calls a logout function that clears any session storage.




***** CHDB3P17
      -------

***** ASHIQUE M K
      -------------

