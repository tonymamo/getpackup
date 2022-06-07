import { Button, HeroImage } from '@components';
import { borderColor, offWhite, white } from '@styles/color';
import { baseSpacer, halfSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
/* eslint-disable no-console */
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { useFirebase } from 'react-redux-firebase';
import styled from 'styled-components';
import {
  Camera,
  Crop,
  Facebook,
  Flip,
  Instagram,
  Local,
  Reddit,
  Twitter,
  URL,
  Uppload,
  en,
} from 'uppload';

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
  min-height: calc(100vw / 7); /* 7 is to match approximate aspectRatio of HeroImage */
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: ${baseSpacer};
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
    uploader.use([new Local()]);
    uploader.use([new Crop({ aspectRatio: 16 / 4 }), new Flip()]);
  }, [uploader]);

  uploader.on('before-upload', () => {
    setIsLoading(true);
  });

  uploader.on('upload', (newUrl: string) => {
    if (type === 'trip') {
      firebase.firestore().collection('trips').doc(id).update({
        headerImage: newUrl,
        lastUpdated: new Date(),
      });
      trackEvent('New Trip Header Image Uploaded', {
        tripId: id,
        headerImage: newUrl,
      });
    }
    if (type === 'profile') {
      firebase.firestore().collection('users').doc(id).update({
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
        <HeroImage staticImgSrc={image as string} justifyContent="flex-end" alignItems="flex-end">
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
            style={{ zIndex: 1 }}
          >
            Add
          </Button>
        </HeroImageUploadPicker>
      )}
    </HeroImageUploadWrapper>
  );
};

export default HeroImageUpload;
