import React, { useState, useEffect } from 'react';
// Bootstrap
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

// Firebase
import * as firebase from "firebase/app";
import "firebase/auth";

import './App.css';

function App() {

  // Firebase config
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
  };

  // Declarations
  const [displayName, setDisplayName] = useState('');
  const [providerId, setProviderId] = useState('');
  const [entityId, setEntityId] = useState('');
  const [ssoUrl, setSsoUrl] = useState('');
  const [certificate, setCertificate] = useState('');
  const [spEntityId, setSpEntityId] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');

  // Loader
  const [isLoading, setIsLoading] = useState(false);

  // Error handlers
  const [errCode, setErrCode] = useState(null);
  const [errMessage, setErrMessage] = useState(null);

  // Success handlers
  const [userEmail, setUserEmail] = useState<string | null>();
  const [operationType, setOperationType] = useState<string | null>();
  
  // Hook
  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
  }, []);

  const startConfigTest = async () => {

    // Reset
    setIsLoading(true);
    setErrCode(null);
    setErrMessage(null);
    setUserEmail(null);
    setOperationType(null);

    // Prepare test data
    const configObj = {
      displayName: displayName,
      providerId: providerId,
      entityId: entityId,
      ssoUrl: ssoUrl,
      certificate: certificate,
      spEntityId: spEntityId,
      callbackUrl: callbackUrl
    };

    // Upload configuration to Firebase via backend server
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(configObj)
    };
    const response = await fetch('/test-config', requestOptions);
    const data = await response.json();
    console.log(data);

    // Check for errors
    if (data.err) {
      setErrCode(data.err.code);
      setErrMessage(data.err.message);
      setIsLoading(false);
      return;
    }

    // Sign in using SAML
    const provider = new firebase.auth.SAMLAuthProvider(data.providerId);
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      setUserEmail(result.user?.email || 'N/A');
      setOperationType(result.operationType || 'N/A');
    } catch (err) {
      setErrCode(err.code);
      setErrMessage(err.message);
    }
    setIsLoading(false);
  }

  return (
    <div>
       <Container className="p-3">
        <Jumbotron className="App">
          <h1 className="header">Remo SAML Config Tester</h1>
        </Jumbotron>
        <Row>
          <Col>
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formDisplayName">
                    <Form.Label>Display name</Form.Label>
                    <Form.Control value={displayName} type="text" placeholder="Enter display name" onChange={event => setDisplayName(event.target.value)} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formProviderId">
                    <Form.Label>Provider ID</Form.Label>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>
                          saml.
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control value={providerId} type="text" placeholder="Enter provider ID" onChange={event => setProviderId(event.target.value)} />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formEntityId">
                    <Form.Label>Entity ID</Form.Label>
                    <Form.Control value={entityId} type="text" placeholder="Enter entity ID" onChange={event => setEntityId(event.target.value)} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formSsoUrl">
                    <Form.Label>SSO URL</Form.Label>
                    <Form.Control value={ssoUrl} type="text" placeholder="Enter URL" onChange={event => setSsoUrl(event.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formCertificate">
                <Form.Label>Certificate</Form.Label>
                <Form.Control value={certificate} as="textarea" type="text" onChange={event => setCertificate(event.target.value)} />
                <Form.Text className="text-muted">
                  Must start with "-----BEGIN CERTIFICATE-----", and end with "-----END CERTIFICATE-----".
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formSpEntityId">
                <Form.Label>Service provider entity ID</Form.Label>
                <Form.Control value={spEntityId} type="text" placeholder="live.remo.co" onChange={event => setSpEntityId(event.target.value)} />
              </Form.Group>
              <Form.Group controlId="formCallbackUrl">
                <Form.Label>Callback URL</Form.Label>
                <Form.Control value={callbackUrl} type="text" placeholder="live.remo.co" onChange={event => setCallbackUrl(event.target.value)} />
              </Form.Group>
            </Form>
          </Col>
          <Col style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Col style={{textAlign: 'center'}}>
              { errCode && errMessage && 
                <Alert key={errCode} variant='danger' onClose={() => setErrCode(null)} dismissible>
                  <Alert.Heading>{errCode}</Alert.Heading>
                  <p>{errMessage}</p>
                </Alert>
              }
              { userEmail && operationType && 
                <Alert key={errCode} variant='success' onClose={() => setUserEmail(null)} dismissible>
                  <Alert.Heading>{operationType} successful!</Alert.Heading>
                  <p>{userEmail}</p>
                </Alert>
              }
              <Button variant="success" size="lg" onClick={startConfigTest} disabled={isLoading}>
                { isLoading ?
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                  /> : <span>Test config</span>
                }
              </Button>
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

