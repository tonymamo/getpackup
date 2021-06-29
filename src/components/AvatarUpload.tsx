/* eslint-disable no-console */
import React, { FunctionComponent, useEffect, useMemo } from 'react';
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
import styled from 'styled-components';
import { FaCamera } from 'react-icons/fa';

import { RootState } from '@redux/ducks';
import trackEvent from '@utils/trackEvent';
import { doubleSpacer, tripleSpacer } from '@styles/size';
import { textColor, white } from '@styles/color';
import { baseBorderStyle } from '@styles/mixins';
import Avatar from './Avatar';

const AvatarUploadWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const EditButton = styled.button`
  border-radius: ${doubleSpacer};
  width: ${doubleSpacer};
  height: ${doubleSpacer};
  background-color: ${white};
  color: ${textColor};
  border: ${baseBorderStyle};
  position: absolute;
  bottom: 0;
  right: calc(50% - ${tripleSpacer});
  justify-content: center;
  display: flex;
  align-items: center;
`;

const AvatarUpload: FunctionComponent<{ loggedInUser: any }> = ({ loggedInUser }) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();

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

  uploader.on('upload', (newUrl: string) => {
    firebase
      .firestore()
      .collection('users')
      .doc(auth.uid)
      .update({
        photoURL: newUrl,
        lastUpdated: new Date(),
      });
    trackEvent('New User Avatar Uploaded', { user: auth.email, photoURL: newUrl });
    uploader.close();
  });

  return (
    <AvatarUploadWrapper>
      <Avatar src={loggedInUser.photoURL} size="xl" gravatarEmail={loggedInUser.email} />
      <EditButton type="button" onClick={() => uploader.open()}>
        <FaCamera color={textColor} />
      </EditButton>
    </AvatarUploadWrapper>
  );
};

export default AvatarUpload;
