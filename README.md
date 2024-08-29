# Wellfound Takehome Project

This project is a full-stack application featuring a Postgres database, a Typescript Node.js/Express backend, and a Typescript React frontend using Vite.

The backend is created using Sequelize-typescript as an ORM and Express.js to handle server requests. Accounts are secured using bcrypt to hash passwords and jwts to authenticate login sessions. There is an auth protection middleware that can be applied to routers that stop any unauthenticated users from making requests to those routes. Currently anyone can make an admin account but that would be revoked in a live setting. The DB schema is as follows 
the main models are Users, Listings, Candidates
Users can own many Listings
many Candidates can be assigned many Listings via a through table, Applicant 

The frontend is created with Typescript React using Vite. React-router is used to handle internal routing in the application and Chakra-UI is used for UI elements. I designed the frontend to have hooks that integrate with the APIs, and each hook provides its own context to the application so that the whole app uses the same state as a source of truth and can update that state through the API providers. I also allowed my fetch abstraction to have access to a global auth object so all API requests would be authenticated automatically. My fetch also handles errors and displays them in a toastbox so every endpoint doesn't have to implement its own error handling. I implemented two main pages: Lisings and Candidates. On the Candidates page you can Create/Modify/Delete any candidate as long as you are an authorized admin. On the listing page, you can View listings, and optionally Create/Modify/Delete if you are an admin. Also admins have the power to assign Candidates to Listings.

## Prerequisites

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)

## Getting Started

This Project has a Client and a Server which communicates with a PSQL database. 

### 1. Start Docker Container (DB and Server)

This will create a database and start the server

```
docker-compose up --build
```
 - Backend accessible at localhost:8080
 - Postgres accessible at localhost: 5432

(There is a bug on windows with bcrypt with loading the c libraries that are used on windows vs lunux in the docker, make sure you delete cached bcrypt module in server/npm-modules if built on local windows machine before building docker)

### 2. Start the Client (Vite dev server)

```
cd client
npm install
npm run dev
```
client available at http://localhost:5173

### 3. Demo the app:
 1. Create an account. Navigate to the login page, sign up with any email (string is not validated so it can just be a name or "user"). Password is encrypted and stored in the database
 2. Navigate to the "Candidates" page to create a few test candidates by clicking on 'Create New Candidate'
 3. Navigate to Listings and create a few new listings by clicking 'Create New Listing'
 4. Apply candidates to listings. On the listings page, Click the 'Candidates(x)' button to see all candidates who can apply, click 'Apply' to apply them to the listing. 
 5. See All applied Candidates by clicking on the 'Applied(x)' button and unapply a candidate

## Tech Stack
 - Brief overview of the stack and why I chose it 
    - Postgres: Reccomended DB, This project could have reasonably used any relational DB, Psql is my preference, but mySQL is also a common choice that could have been equally considered with psql because it is natively supported by sequelize
    - Vite: I chose to use vite for my react bootstrap because create-react-app is being depricated and vite has ongoing support, also it is a lot faster
    - Typescript React: The spec called for react, I elected to use typescript because I believe its neccesary now-a-days to build production grade code and have a strongly typed contract throughout your application
    - React-router: The spec called to use it and it is my go-to library to handle routing in react
    - Chakra UI: The spec called to use it and it, not my go-to, but gets the job done
    - Typescript Express: I prefer to use typescript over plain node.js because it makes code more readable, understandable, and maintainable, while avoiding potential run-time errors. 
    - Sequelize Typescript: Spec called for Sequelize and I prefer the typescript version to keep everything in a typescript monolith. Its also a lot cleaner and gains all the other benefits from typescript that I mentioned

## Notes I have about improvements and next steps

 - Being a takehome project with the note 'Focus on core functionality and avoid unnecessary features. ', I tried to keep the functionality as basic as possible and not add anything un-needed for the spec. That being said, there were some technical things that I thought would be needed for this project to be practical. Here are some next steps I was envisioning when designing this:
  1. 'Candidates' will need be real accounts created by non-admin users. To achieve this, candidates would have their own login and permissions. I considered storing 'candidates' as Users with a permission flag of 'candidate' or something, but I think I would have moved forward storing Candidates as their own user table, giving them their own account create/login/management endpoints as well as jwt authentication so they could access their account and search for listings/apply. I like this solution over combining the tables because we would not have job posters/admins also applying for listings and the information needed for the two types of users is vastly different. Also unrealted, we would probably want to add google oAuth to provide more sign-in options later.
  2. Next, we would want to add a full profile, allowing the user to upload profile pictures, resumes, as well as other metadata about their skills and job preferences. In order to implement this I would likely create file upload endpoints in our server that store our img and PDFs in s3 and store the s3 links in our database under the user table. 
  3. Admins are currently able to modify all job listings. In the future we would restrict access from admins solely to listings they have created. This would be done with another token authenticator middleware function that ensures the listing in question belongs to the authenticated user. This leads us down a rabbit hole of designing more permissions architecture, possibly creating an Organization table so that multiple users can act as organization members in ownership of a listing. This would change the schema to have users belong to an organizaiton and each listing belong to an organization
  4.  The front end is very minimalistic. Would obviously need to be designed a lot more. I would start by creating more common styled components like I did for the modal. Would also mix in some iconography, create a logo, all that jazz. Also in reality we would have a lot more information about candidates and listings to display so I would have to adjust the design to show all of that properly. I would give list items a full page layout that you can click into from the list view
  5. I chose to have a seperate tab for listings and Candidates instead of one page where admins would manage both. I did this because the listings page still funcitons even if you are logged out, and if you are logged in you are granted admin abilities. 
  6. We would want to give users a way to communicate with Applicants. We could probably add a 'message' field to an Applicant object in the database, and then add a 'status' as well so that admins could read the application message and accept the member. 
  7. After we added more resumes and metadata, we would probably want to do a lot with that. 
   - Backend, add some pdf parsing and analysis (possibly with LLMs). We could vectorize the information in the resume and store in another database for easy search of hundreds of thousands of resumes by key topics in seconds. 
   - Frontend, add searching capabilities and auto matching capabilities to make it easier to find qualified candidates. 