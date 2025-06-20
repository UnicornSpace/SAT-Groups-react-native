import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

// Simple dots animation component
const LoadingDots = ({ style }:any) => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '.';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <Text style={style}>{dots}</Text>;
};


export default LoadingDots;