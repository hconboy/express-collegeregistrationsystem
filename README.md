1. BUILD: 

1.1. npm install

1.2. In your online MongoDB account, create a new database called "college_registration_system"

1.3. Edit the bin/www file to have your online MongoDB connection URL

1.4. Import initial test data to your MongoDB with: 

node populatedb <YOUR_ONLINE_MONGODB_CONNECTION_URL>

2. DOC: npm run doc

    Open the jsdoc/index.html file in a web browser

3. RUN: 

    3.1. Run the backend

        Unix-like: npm run devstart

        Windows: npm run start

    3.2. Run the frontend

        Open "http://localhost/3000" in a web browser


4. TEST: npm test 
    
    Should pirnt out testing result to the console

5. COVERAGE: npm run coverage

    Open the coverage/index.html file in a web browser