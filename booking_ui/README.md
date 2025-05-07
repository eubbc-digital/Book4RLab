# Booking UI

This is an Angular project that provides an User Interface for the Booking System.

## Usage
With the repository already cloned in your system navigate to the *booking_ui* directory:

```bash
cd Book4RLab/booking_ui/
```

### Environment Setup
To ensure proper configuration of the Booking UI, create an environment file named `.env` in the project root with the following variables:

#### `.env` File Template

```env
###DOCKER
RESTART_POLICY={no_or_always}
```

#### Environment Variables Reference
| Variable            | Description                          | Valid Values         |
|---------------------|--------------------------------------|----------------------|
| `RESTART_POLICY`    | Container restart behavior           | `no` for development<br>`always` for production |

### Additional Configuration
#### The `config.json` file
This file holds the UI configuration. Update the `baseUrl` field according to your environment:

| Environment  | Configuration Example                |
|--------------|--------------------------------------|
| Development  | `"baseUrl": "http://localhost:8000/"` |
| Production   | `"baseUrl": "https://<domain>/booking/api/"` |

#### The Dockerfile
For **development** environment, modify this line:

```bash
RUN npm run ng build -- --base-href /booking/
```

To this:

```bash
RUN npm run ng build
```

### Running the Project

Once the environment setup is done you can run the project following the next steps:

 - Build the docker image running the following command:

  ```bash
  docker-compose build
  ```

 - Run UI:

  ```bash
  docker-compose up
  ```

> **Note:** The `.env` file should be created before running these commands.

The Angular project (dev) can be accessed via [http://localhost:4200](http://localhost:4200)
