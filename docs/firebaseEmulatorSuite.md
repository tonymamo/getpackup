

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
firebase login (follow prompts in browser)
firebase use getpackup 

gcloud projects list
gcloud config set project getpackup
```
3.  **Export production database**
From root of getpackup repo
```shel
gcloud firestore export gs://getpackup.appspot.com/dev-firebase
```
4.  **Download the export you just created**
```shel
gsutil -m cp -r gs://getpackup.appspot.com/dev-firebase ./dev-firebase
```

  1.  **Init Emulators**
```shel
firebase init emulators
```