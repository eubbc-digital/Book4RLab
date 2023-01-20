# Book4RLab
Book4RLab is a booking system for remote laboratories. It consists of a RESTful API built using Django and a user interface built using Angular.

![](assets/architecture.png)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
You will need to have Docker and Docker Compose installed on your machine.

### Installing
To get the project up and running, clone the repository and navigate to the project's root directory.

`git clone https://github.com/eubbc-digital/Book4RLab`

`cd ui`

or 

`cd api`

Next, build and start the services using Docker Compose.

`docker-compose up --build`

This command will start the Django API on port 8000 and the Angular UI on port 4200.

### Usage
You can access the user interface by navigating to http://localhost:4200 in your web browser.

The API can be accessed at http://localhost:8000.

### Deployment
The project is designed to be easily deployable to a production environment. You can use any container orchestration tool, such as Kubernetes or Docker Swarm, to deploy the services.

### Built With

This project was built using the following technologies:

 - Django - The web framework used for the API.
 - Angular - The framework used for the user interface.
 - Docker - Used for containerization.

## Authors

 - Adriana Orellana (Universidad Privada Boliviana - UPB)
 - Angel Zenteno (Universidad Privada Boliviana - UPB)
 - Alex Villazon (Universidad Privada Boliviana - UPB)
 - Omar Ormachea (Universidad Privada Boliviana - UPB)

## Acknowledgments

This work was partially funded by the Erasmus+ Project “EUBBC-Digital” (No.
618925-EPP-1-2020-1-BR-EPPKA2-CBHE-JP)

![](assets/erasmus.jpeg)

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## More Information
For more information about the project, please visit our [website](https://eubbc-digital.upb.edu/).
