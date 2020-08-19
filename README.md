# SAML Configuration Tester

This project is to test SAML configuration to be used with [Firebase/GCIP](https://console.cloud.google.com).

## Technical Details

1. This project consists of a `Node` server and a `React` client. 
2. The `server` uses the [Firebase Admin SDK](https://firebase.google.com/docs/reference/admin) to create a SAML provider config on your **GCP instance**. 
3. Once the SAML provider config is generated, the `client` uses it to try to do a login. 
4. If login is successful, the configuration is correct. 
5. If login fails, the configuration needs to be updated. 

## OK, how do I use this?

1. Clone or fork the project. 
2. Run `npm install` on the root directory. This will install the packages needed by the server. 
3. Run `cd client && npm install` to install the packages required for the client.
4. Update the `.env` file in the root directory with the path to your `GOOGLE_APPLICATION_CREDENTIALS`. More info on how to get this file is [here](https://cloud.google.com/docs/authentication/getting-started).
5. Upate the `client/.env` file with your **Firebase API Key** and **Auth Domain**. 
6. Run `npm run start-server` to start the server.
7. Run `npm run start-client` to start the client.
8. Navigate to [http://localhost:3000/](http://localhost:3000/).



