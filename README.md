# Assignment II: Centerling News

Welcome to the second assignment of the Web Development elective!
In this assignment you will implement a clone of Y-Combinators popular deep-tech news platform Hacker News.
You can find the complete instructions in the PDF in this repository.

The goal of this exercise is to familiarize and practice developing a full stack web application.
You will develop an API with [ExpressJS](https://expressjs.com/), [Mongoose](https://mongoosejs.com/) and [MongoDB](https://www.mongodb.com/) (Backend) and a client-facing user interface in [ReactJS](https://reactjs.org/) (Frontend).
The overall time to complete this exercise is probably somewhere **between 20 and 30 hours**, depending on your speed.

> **Note:** This is the first time we do this elective.
> We would like to know how much time it takes you to complete the assignments to improve this course in the future.
> We would be grateful, if you could to track the time it takes you to complete this assignments.
> We recommend tools like toggl.com or clockify.me for this.
>
> How long it takes you to finish any assignment will not affect grading in any way.


## Preparation
Make sure you have the following things prepared before the next session:

- Install Visual Studio Code: https://code.visualstudio.com/
- Install Node JS and npm (LTS): https://www.npmjs.com/get-npm
- Install Sourcetree: https://www.sourcetreeapp.com/

#### Optional, but useful
- Install Postman: https://www.postman.com/
- Install MongoDB Compass (Community Edition): https://www.mongodb.com/download-center/compass
- Install MongoDB locally: https://docs.mongodb.com/manual/administration/install-community/

## Instructions

> **Note:** The full instructions can be found in the PDF in this repository.
> If there is ambiguous information between this readme.md and the PDF, the PDF 
> is the *source of truth*.
> If in doubt, ask :)

### 1. Complete the following readings (mandatory)

Please take the time to read the following articles, before you jump into development. They will help you to mitigate some of the beginners errors you would otherwise run into.

- Callbacks, Promises, Async(~15 minutes read time)https://scotch.io/courses/10-need-to-know-javascript-concepts/callbacks-promises-and-async
- Express, a popular Node.js Framework (~20 minutes read time)https://flaviocopes.com/express/
- Environment Variables: Decoupling Configuration (~10 minutes read time)https://stackabuse.com/managing-environment-variables-in-node-js-with-dotenv/
- A developer’s introduction to React (~25 minutes read time) https://jaxenter.com/introduction-react-147054.html
- Introduction to fetch() (~10 minutes read time)https://developers.google.com/web/updates/2015/03/introduction-to-fetchLearn 
- The MERN Stack (107 minutes video)https://www.youtube.com/watch?v=7CqJlxBYj-M


#### Optional Readings

These readings are optional, but will help you understand advanced concepts (such as React-Redux) and make you a better developer. If you are struggeling with Javascript, I would recommend you to read through the first article.

- 10 Need to Know Javascript Concepts (~90 minutes read time)https://scotch.io/courses/10-need-to-know-javascript-concepts
- The only introduction to Redux you’ll ever need (~25 minutes read time)https://medium.com/javascript-in-plain-english/the-only-introduction-to-redux-and-react-redux-youll-ever-need-8ce5da9e53c6
- Ninja Code (How to not write JS) (~10 minutes read time)https://javascript.info/ninja-code
- Javascript Clean Code Best Practices (~10 minutes read time) https://blog.risingstack.com/javascript-clean-coding-best-practices-node-js-at-scale/
- A successful Git branching model (~10 minutes read time)https://nvie.com/posts/a-successful-git-branching-model/
- How to write a Git Commit Message (~10 minutes read time)https://chris.beams.io/posts/git-commit/


### 2. Finish implementing the “Centerling News” application in this repository

- Fork this repository
- Implement the open user stories (see presentation or issues)
- Make sure to follow Git Flow 
    - For each user story create a feature branch from develop
    - Once implemented merge the feature branch back into develop using a merge request, in which you summarize the changes you made
    - Once all user stories are developed, create a merge request from develop into master and assign your coach as reviewer (latest 27th April)


### 3. Come up with a project idea with another student from this class.
- Your project should include CRUD functionality and require implementation across React, Express and MongoDB.
- You should have a partner and idea by the next session, since we will develop the idea in a workshop format. 

### 4. Once you finish all of the above tasks, fill out the following survey
- https://forms.gle/bay5hHKDii1uwhTG9


## Getting Started

The following section describes how to get started with the code provided in this repository. There is also a step by step guide in the assignment 2 pdf.

The following steps need to be completed before you can start coding. We will do some of these steps together in class. For all of this, make sure you have VS Code, NodeJS and npm installed.

#### 2.1 Fork this repository
- Fork this repository, so you have and Assignment 2 repository in your personal namespace

#### 2.2.Clone this repository and set up SourceTree
- Clone the forked repository with Sourcetree

#### 2.3 Register and Set Up Mongo Atlas
- Register a MongoDB Atlas Account https://www.mongodb.com/cloud/atlas/
- Allow Network Access from anywhere
- For your cluster, copy the connection string (you may need to create a DB user first)

#### 2.4 Set up the Server
- Open a terminal in the `api/` folder of your cloned repository
- Copy the `.env.example` to `.env` and configure the environment variables
- Run `npm install`
- Run `npm run dev` 

#### 2.5 Set the React Client
- Open a terminal in the `centerlingnews/` folder of your cloned repository
- Copy the `.env.example` to `.env` and configure the environment variables
- Run `yarn install`
- Run `yarn start`



