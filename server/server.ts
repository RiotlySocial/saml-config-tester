// Environment setup
require('dotenv').config()

// Import essential libs
import express from 'express';
import bodyParser from "body-parser";
import * as admin from 'firebase-admin'

// Initialize Firebase SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

// Create a new express app instance
const app: express.Application = express();

// For req.body yo!!
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Test route
app.get('/', function (req: express.Request, res: express.Response) {
    res.send('Hello World!');
});

// Main route
app.post('/test-config', async (req, res) => {

    let configObj: admin.auth.SAMLAuthProviderConfig = {
        enabled: true,
        displayName: req.body.displayName,
        providerId: 'saml.' + req.body.providerId,
        idpEntityId: req.body.entityId,
        rpEntityId: req.body.spEntityId,
        ssoURL: req.body.ssoUrl,
        x509Certificates: [req.body.certificate],
        callbackURL: req.body.callbackUrl
    };

    // Create provider config in Firebase
    try {
        const response = await admin.auth().createProviderConfig(configObj);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({
            err: err
        });
    }
});


// Start server
app.listen(3001, function () {
    console.log('App is listening on port 3001!');
});
