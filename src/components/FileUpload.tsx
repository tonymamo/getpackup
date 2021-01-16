/* eslint-disable no-console */
import React, { FunctionComponent, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import {
  Uppload,
  en,
  Local,
  Camera,
  Crop,
  Instagram,
  Facebook,
  Twitter,
  URL,
  Reddit,
  Flip,
} from 'uppload';

import { RootState } from '@redux/ducks';
import Button from './Button';
import Avatar from './Avatar';
import FlexContainer from './FlexContainer';

const FileUpload: FunctionComponent<{ loggedInUser: any }> = ({ loggedInUser }) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();

  const [isLoading, setIsLoading] = useState(false);

  const uploader = useMemo(
    () =>
      new Uppload({
        lang: en,
        defaultService: 'local',
        compression: 0,
        compressionToMime: 'image/jpeg',
        maxSize: [512, 512],
        uploader: (file, updateProgress) =>
          new Promise((resolve, reject) => {
            const storageReference = firebase.storage().ref();
            const reference = storageReference.child(`${auth.uid || ''}/avatar`);
            const uploadTask = reference.put(file);
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (updateProgress) updateProgress(progress);
              },
              (error) => {
                console.log('Got error', error);
                return reject(new Error('unable_to_upload'));
              },
              () => {
                console.log('Uploaded!');
                uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then((url) => resolve(url))
                  .catch(() => reject(new Error('unable_to_upload')));
              }
            );
          }),
      }),
    []
  );

  useEffect(() => {
    uploader.use([
      new Local(),
      new Camera(),
      new Instagram(),
      new Facebook(),
      new Reddit(),
      new Twitter(),
      new URL(),
    ]);
    uploader.use([new Crop({ aspectRatio: 1 }), new Flip()]);
  }, [uploader]);

  uploader.on('before-upload', () => {
    setIsLoading(true);
  });

  uploader.on('upload', (newUrl: string) => {
    firebase
      .firestore()
      .collection('users')
      .doc(auth.uid)
      .update({
        photoURL: newUrl,
      });
    setIsLoading(false);
    uploader.close();
  });

  return (
    <FlexContainer flexDirection="column">
      <Avatar src={loggedInUser.photoURL} size="lg" gravatarEmail={loggedInUser.email} />
      <Button
        type="button"
        onClick={() => uploader.open()}
        color="text"
        isLoading={!auth.isLoaded || isLoading}
      >
        Change Profile Photo
      </Button>
    </FlexContainer>
  );
};

export default FileUpload;
