/* eslint-disable no-console */
import React, { FunctionComponent, useEffect, useState, useMemo } from 'react';
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

import trackEvent from '@utils/trackEvent';
import { Button, HeroImage } from '@components';
import { borderColor, offWhite, textColor, white } from '@styles/color';
import { baseSpacer, doubleSpacer, halfSpacer } from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';

type HeroImageUploadProps = {
  type: 'trip' | 'profile';
  id: string;
  image?: string;
};

const HeroImageUploadWrapper = styled.div`
  margin-bottom: ${baseSpacer};
`;

const HeroImageUploadPicker = styled.div`
  border: 2px dashed ${borderColor};
  background: repeating-linear-gradient(
    45deg,
    ${white},
    ${white} ${halfSpacer},
    ${offWhite} ${halfSpacer},
    ${offWhite} ${baseSpacer}
  );
  min-height: calc(100vw / 5); /* 5 is to match aspectRatio of HeroImage */
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: ${baseSpacer};
`;

const EditButton = styled.button`
  border-radius: ${doubleSpacer};
  width: ${doubleSpacer};
  height: ${doubleSpacer};
  background-color: ${white};
  color: ${textColor};
  border: ${baseBorderStyle};
  justify-content: center;
  display: flex;
  align-items: center;
`;

const HeroImageUpload: FunctionComponent<HeroImageUploadProps> = ({ type, id, image }) => {
  const firebase = useFirebase();

  const [isLoading, setIsLoading] = useState(false);

  const uploader = useMemo(
    () =>
      new Uppload({
        lang: en,
        defaultService: 'local',
        compression: 0,
        compressionToMime: 'image/jpeg',
        maxSize: [2048, 512],
        uploader: (file, updateProgress) =>
          new Promise((resolve, reject) => {
            const storageReference = firebase.storage().ref();
            const path = type === 'trip' ? `trips/${id}` : `${id}/profile`;
            const reference = storageReference.child(path);
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
    uploader.use([new Crop({ aspectRatio: 16 / 4 }), new Flip()]);
  }, [uploader]);

  uploader.on('before-upload', () => {
    setIsLoading(true);
  });

  uploader.on('upload', (newUrl: string) => {
    if (type === 'trip') {
      firebase
        .firestore()
        .collection('trips')
        .doc(id)
        .update({
          headerImage: newUrl,
          lastUpdated: new Date(),
        });
      trackEvent('New Trip Header Image Uploaded', {
        tripId: id,
        headerImage: newUrl,
      });
    }
    if (type === 'profile') {
      firebase
        .firestore()
        .collection('users')
        .doc(id)
        .update({
          profileHeaderImage: newUrl,
          lastUpdated: new Date(),
        });
      trackEvent('New User Profile Header Image Uploaded', {
        uid: id,
        profileHeaderImage: newUrl,
      });
    }

    setIsLoading(false);
    uploader.close();
  });

  return (
    <HeroImageUploadWrapper>
      {image ? (
        <HeroImage
          staticImgSrc={image as string}
          aspectRatio={5}
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <Button
            color="tertiary"
            size="small"
            type="button"
            onClick={() => uploader.open()}
            iconLeft={<FaCamera />}
          >
            Edit
          </Button>
        </HeroImage>
      ) : (
        <HeroImageUploadPicker>
          <Button
            type="button"
            onClick={() => uploader.open()}
            color="tertiary"
            isLoading={isLoading}
            size="small"
            iconLeft={<FaCamera />}
          >
            Upload
          </Button>
        </HeroImageUploadPicker>
      )}
    </HeroImageUploadWrapper>
  );
};

export default HeroImageUpload;
