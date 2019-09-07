import React, { useState } from 'react';
import { Image, ImageProps, Dimensions } from 'react-native';

interface IProps extends ImageProps {
  // uri: string;
  source: {
    uri: string;
  };
  width?: number;
  height?: number;
}

export const ImageAuto = (props: IProps) => {
  const dimensions = Dimensions.get('window');
  const screenWidth = dimensions.width;
  const screenHeight = dimensions.height;
  const whScale = dimensions.width / dimensions.height;

  const [w, setW] = useState<number>(screenWidth);
  const [h, setH] = useState<number>(screenWidth / whScale);

  // useEffect(() => {
  Image.getSize(
    props.source.uri,
    (width: number, height: number) => {
      if (props.width && !props.height) {
        console.log('1, props.width && !props.height', props);
        setW(200);
        // setW(props.width);
        setH(height / (props.width / width));
        // setH(10);
      } else if (!props.width && props.height) {
        console.log('2, !props.width && props.height', props);
        setW(width * (props.height / height));
        setH(props.height);
      } else {
        console.log('3, else', props);
        setW(props.width || screenWidth);
        setH(props.height || screenWidth / whScale);
      }
    },
    (e: Error) => {
      console.log(e);
      setW(screenWidth);
      setH(screenWidth / whScale);
    },
  );
  // }, []);

  // useEffect(() => {
  // Image.getSize(
  //   props.source.uri,
  //   (width: number, height: number) => {
  //     setW(w);
  //     setH(h);
  //   },
  //   (e: Error) => {
  //     setW(screenWidth);
  //     setH(screenWidth / whScale);
  //     // console.log(e);
  //   },
  // );
  // }, []);

  console.log('XXXXXXXXXX', w, h);

  return <Image source={{ uri: props.source.uri }} style={{ width: w, height: h }} />;
  // return <Image source={{ uri: props.source.uri }} style={{ width: 200, height: 200 }} />;
};
