
# Book4RLab

Book4RLab is a booking system for remote laboratories.

The Booking system is aimed to reserve slots of the different Remote Laboratories and available equipment, with minimum intervention of the teacher.
The learners will be able to reserve slots and a QR code and a link will allow to enter the reserved remote lab.

Different Remote Labs from Project Partners can use the Remote Lab Booking System, which required small modification of their Remote Lab server application.

<p align="center">
  <img src="assets/architecture.png"/>
</p>

## Usage
### Prerequisites

Before getting started, ensure you need to have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your system.

### Components

The project consists of two main components:

-   **RESTful API:** Built using [Django](https://www.djangoproject.com/).
-   **User Interface (UI):** Built using [Angular](https://angular.io/).

### Setup

To set up the project, follow these instructions for each component:
- [Booking API Setup](booking_api/README.md)
- [Booking UI Setup](booking_ui/README.md)

These instructions will lead you through the setup process for both the API and UI components individually, providing step-by-step instructions to get a local development and testing environment up and running with ease.

### Interacting with the Project

To interact with different components of the project, follow these steps:

- **User Interface (UI):** Access the user interface by navigating to [http://localhost:4200](http://localhost:4200) in your web browser.

- **API:** Interact with the API endpoints available at [http://localhost:8000](http://localhost:8000).

### Deployment

The project's containerized architecture ensures easy deployment in a production environment.

You can utilize any container orchestration tool, such as Kubernetes or Docker Swarm, to deploy the services.

Additionally, for efficient handling of HTTP traffic, consider incorporating Nginx into your deployment setup to enhance performance and scalability.

## Authors

 - Adriana Orellana (Universidad Privada Boliviana - UPB)
 - Angel Zenteno (Universidad Privada Boliviana - UPB)
 - Alex Villazon (Universidad Privada Boliviana - UPB)
 - Omar Ormachea (Universidad Privada Boliviana - UPB)

## Acknowledgments

This work was partially funded by the Erasmus+ Project “EUBBC-Digital” (No.
618925-EPP-1-2020-1-BR-EPPKA2-CBHE-JP)

<p align="center">
  <img src="assets/erasmus.jpeg"/>
</p>

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## More Information
For more information about the project, please visit our [website](https://eubbc-digital.upb.edu/).
