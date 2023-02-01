import { Button, Column, Heading, Row } from '@components';
import { borderColor, offWhite, white } from '@styles/color';
import { baseSpacer, halfSpacer } from '@styles/size';
import firebase from 'firebase/app';
import React, { useMemo } from 'react';
import { FaCamera } from 'react-icons/fa';
import styled from 'styled-components';
import { Uppload, en } from 'uppload';

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

const ImageOption = styled.img`
  margin-bottom: ${baseSpacer};
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

export default function ImageForm(props: any) {
  const {
    formField: { heroImage },
  } = props;

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
            const path = `trips/new`;
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

  const predefinedChoices = [
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1617244552/getpackup/0f1a2062-3.jpg',
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1617244549/getpackup/044a8781.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1617244550/getpackup/044a9077-2-2.jpg',
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1617244547/getpackup/044A0009-2.jpg',
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1617244545/getpackup/SnowboarderCuttingTracksOnTheEdgeOfTheShadowOnVirginSnow.jpg',
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1617244556/getpackup/WatertonHike.jpg',
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_auto,h_512,w_2048/v1617244555/getpackup/chamonix-chrisbrinleejr-sep17-78.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1626723073/getpackup/0F1A2340_zy0asj.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1626723079/getpackup/0F1A2357_ngyjwq.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1626131678/getpackup/PanoramaresortBC_TaylorBurk_yhq9bv.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131677/getpackup/BergLakeSunrise_TaylorBurk_gfpilg.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131677/getpackup/VancouverIslandBC_TaylorBurk_fyyalh.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131677/getpackup/Taylor_Burk_Patagonia_z1bec8.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131677/getpackup/VancouverIsland_TaylorBurk-7_zhwgh2.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131674/getpackup/044A4171_vpkdel.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131672/getpackup/BanffNationalParkAB2_TaylorBurk_cj27sc.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131671/getpackup/GrosMorneNFLD_TaylorBurk-15_cxae7q.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131669/getpackup/IceCaveBanffAlberta_TaylorBurk_lb0kfs.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131669/getpackup/GrosMorneNFLD_TaylorBurk-2_oio34q.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131665/getpackup/ElkIslandNationalParkAlberta_TaylorBurk_e0nahc.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1626131664/getpackup/044A5545-3_bcokpp.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131661/getpackup/044A8754-4_vmipxk.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131660/getpackup/044A4630-3_mwf30b.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1626131659/getpackup/044A6928_rawtp5.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131653/getpackup/044A5652-3_l3sjwb.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131653/getpackup/044A0891_kesrw3.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131648/getpackup/0F1A8159_hkeys7.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131643/getpackup/044A2015-11_p8wrzc.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131644/getpackup/0F1A1972_xxnxn7.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131637/getpackup/044A6261-3_xf1fpt.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131637/getpackup/044A6577-3_djipmj.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131635/getpackup/0F1A0636_spg3jy.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131634/getpackup/044A5994-3_ofhstu.jpg',
  ];

  return (
    <>
      <Row>
        <Column xs={8} xsOffset={2}>
          <Heading>Pick a Cover Image</Heading>
        </Column>
      </Row>
      <Row>
        <Column xs={8} xsOffset={2}>
          <HeroImageUploadPicker>
            <Button
              type="button"
              onClick={() => uploader.open()}
              color="tertiary"
              size="small"
              iconLeft={<FaCamera />}
              style={{ zIndex: 1 }}
            >
              Add
            </Button>
          </HeroImageUploadPicker>

          <p style={{ textAlign: 'center' }}>Or choose from one below:</p>

          {predefinedChoices.map((img, index) => (
            <ImageOption src={img} alt="" key={img} onClick={() => console.log(index)} />
          ))}
          <p>
            All photos courtesy of{' '}
            <a href="https://www.taylorburk.com/" target="_blank" rel="noopener noreferrer">
              Taylor Burk Photography
            </a>
          </p>
        </Column>
      </Row>
    </>
  );
}
