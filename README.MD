# Job-Search-App

Job-Search-App is a web application designed to streamline the job search process. Users can register, log in, and add jobs from a provided database specific to their profiles. The app uses Express.js, TypeScript, JavaScript, and MongoDB to provide a seamless experience.

## Features

- **User Registration and Login**: Securely register and log in users.
- **Job Management**: Add jobs from a provided database for specific users.
- **Database**: Uses MongoDB to store user and job information.

## Technologies Used

- **Express.js**: Web application framework for Node.js.
- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **JavaScript**: Core programming language for the application.
- **MongoDB**: NoSQL database for storing job and user data.

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
    ```bash
    git clone (copy url): git@github.com:LukaJovanovic357/Job-search-app.git
    cd Job-Search-App
    ```

2. Navigate to the server directory and install dependencies:
    ```bash
    cd server
    npm install
    ```

3. Configure the environment variables:
    - Copy the `env.example` file to `.env`:
        ```bash
        cp env.example .env
        ```
    - Edit the `.env` file and add your MongoDB connection string, secret key, and port:
        ```env
        MONGO_URI=<Your_MongoDB_String>
        SECRET_KEY=<Your_Secret_Key>
        PORT=<Port_for_server>
        ```

4. Populate the MongoDB database with mock data:
    ```bash
    npm run populate
    ```

5. Start the server:
    ```bash
    npm run dev
    ```

## Usage

Once the server is running, you can access the application at `http://localhost:<Port_for_server>`. Use the web interface to register, log in, and manage your job postings.


Thank you for using Job-Search-App! We hope it helps make your job search process easier.
