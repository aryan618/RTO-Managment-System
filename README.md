# RTO-Managment-System
## 1. Initializing the project
Open a terminal and run

    > git clone https://github.com/dhrrruvin/RTO-Managment-System.git
    > cd RTO-Managment-System
    > npm i

Preferably open the project in VS Code

    > code .
    
## 2. Creating database
1. Download [MySQL](https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-web-community-8.0.32.0.msi) and install
1. Set the root password for MySQL while installation and insert the same in the `.env` file like 

    ```
    DB_PASSWORD=<your_password_here>
    ```
1. After installation, open a terminal and run commands

    ```
    > cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
    > mysql -u root -p
    ```
    Enter the root password and press enter
1. Run all the SQL commands present in `query` file. Just copy them and paste them into the MySQL Shell
## 3. Start server
1. In terminal run

    ```
    > npm run devStart
    ```
1. Open ```http://localhost:3000``` on your browser

___
