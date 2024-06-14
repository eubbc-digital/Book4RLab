# Booking UI

This is an Angular project that provides an User Interface for the Booking System.

## Usage
With the repository already cloned in your system navigate to the *booking_ui* directory:

```
cd Book4RLab/booking_ui/
```

### Environment Setup
To ensure proper configuration of the Booking UI, it's essential to create an environment file named ***.env***. 
This file can be adapted to setup the project either for a *development* or *production* environment.

#### Configuring .env for Development

```
### DOCKER
RESTART_POLICY=no
```
#### Configuring .env for Production

```
### DOCKER
RESTART_POLICY=always
```

#### Environment Variables

The environment variable used for the project is explained in the following table:

| Variable            | Explanation                                                |
|---------------------|------------------------------------------------------------|
| RESTART_POLICY      | Restart policy for Docker containers                       |

### Additional Configuration
#### The `config.json` file

This file holds the UI configuration.

To ensure correct requests, update the `"baseUrl": ""` field to point to your API. Remember, this field may vary based on whether you're using it in a production or development environment.
| Development Environment | Production Environment |
|--|--|
| `"baseUrl": "http://localhost:8000/",` | `"baseUrl": "https://<domain_name>/booking/api/",` |

#### The Dockerfile

While running in the **development** environment you need to modify a line in the `Dockerfile` to avoid base path errors.

Change this line:
```
RUN npm run ng build -- --base-href /booking/
```
To this:
```
RUN npm run ng build
```
### Running the Project

Once the environment setup is done you can run the project following the next steps:

 - Build the docker image running the following command:

	``` 
	docker-compose build 
	```

 - Run UI:
  
	``` 
	docker-compose up 
	```
