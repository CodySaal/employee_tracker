# Employee Tracker

## Description

The motivation behind this project was to create something that used SQL. This project allowed me to practice handling promises and using the CRUD methods. The project solves a business owners concern of not having organized business plans. With this project an owner can quickly pull up the data necessary on each employee as well as add new roles and departments. While completing this project I learn a lot about joining tables of data together. I also learned how to use Set objects.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Installation

The user can clone the code from the GitHub repo. Once the code is cloned and opened in a code editor the user should install all npm packages by running `npm i`. The user will also have to create a .env file in order to store their credentials for the connection. The user needs a DB_USER and DB_NAME within the .env. If the user has a password on their mysql they will also need a DB_PASSWORD which will also need to be put within the connection variable. The last step is to run the schema file with mysql. The user will enter their mysql shell and run `SOURCE db/shema.sql` from the root of the project. The project is now ready to be used.

## Usage

To use this project, after installation, the user can run `npm start` and they will be prompted with the menu. From here the user can choose what they would like to do. Once a choice is made the user will either be prompted to answer a few questions or a table will be shown with the data the user asked for.

[Walkthrough Video](https://drive.google.com/file/d/18truV74izLLe64WVNd49XaVtKJ-BF3-n/view?usp=sharing 'Employee Tracker Walkthrough Video')


## Credits

[Self Join](https://learnsql.com/blog/what-is-self-join-sql/ 'What Is a Self Join in SQL? An Explanation With Seven Examples')

[Set Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set 'Set')

## License

N/A
