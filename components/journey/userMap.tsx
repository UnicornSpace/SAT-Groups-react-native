import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function SVGPathExample() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Svg height="200" width="300">
        {/* Simple line */}
        <Path d="M 10,10 L 100,100" stroke="red" strokeWidth="3" />
        
        {/* Curved path */}
        <Path 
          d="M 150,20 Q 200,50 250,20" 
          stroke="blue" 
          strokeWidth="3" 
          fill="none" 
        />
      </Svg>
    </View>
  );
}