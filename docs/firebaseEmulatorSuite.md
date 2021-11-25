# Firebase Emulator Suite Setup
## Installation

**NOTE: You must start the emulators before starting Gatsby**

1.  **Install Additional Dependencies**
Ref: https://firebase.google.com/docs/cli#mac-linux-npm
```shel
npm install -g firebase-tools
firebase login (follow prompts in browser to select 'getpackup' project)
firebase use getpackup (if not already selected)
```
Install the Cloud SDK
Ref: https://cloud.google.com/sdk/docs/install
```shel
./google-cloud-sdk/install.sh (in root of extracted folder)
./google-cloud-sdk/bin/gcloud init
```
2.  **Connect To Get Packup Project**
```shel
cd dev-firebase
firebase login (follow prompts in browser)
firebase use getpackup 

gcloud projects list
gcloud config set project getpackup
```
3.  **Export production database**
```shel
gsutil -m rm -r gs://getpackup.appspot.com/dev-firebase
gcloud firestore export gs://getpackup.appspot.com/dev-firebase
```
4.  **Download the export you just created**
```shel
gsutil -m cp -r gs://getpackup.appspot.com/dev-firebase .
```
  5.  **Install Cloud Function node_modules**
```shel
cd functions
npm install
cd ..
```
5. **Start Emulators**
```shel
firebase emulators:start --import ./dev-firebase
```
6. **Start Gatsby**
```shel
cd ..
yarn install
yarn start
```
**(Ensure that your .env file has GATSBY_ENVIRONMENT=DEVELOP)**

## Using the Emulators
1. **Local Console**
You can visit the emulator console at http://localhost:4000
2. **Ports**
The Firestore Database runs at http://localhost:8080
3. **Cloud Functions**
Place your cloud functions in ./dev-firebase/functions/index.js