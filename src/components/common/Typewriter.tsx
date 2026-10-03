import React, { useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

interface Props {
  text: string;
  startDelay: number;
  charSpeed: number;
  style?: StyleProp<TextStyle>;
}

export default function Typewriter({ text, startDelay, charSpeed, style }: Props) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, charSpeed);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, startDelay, charSpeed]);

  return <Text style={style}>{displayed}</Text>;
}