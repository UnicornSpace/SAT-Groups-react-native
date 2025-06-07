import { useEffect, useRef } from "react";
import { Animated, ScrollView, View,StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";



// Skeleton Component
const SkeletonLoader = ({ width, height, style }:any) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width,
          height: height,
          backgroundColor: "#E0E0E0",
          borderRadius: 8,
          opacity: opacity,
        },
        style,
      ]}
    />
  );
};

// Skeleton for the Location screen
const LocationSkeleton = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Title and Description Skeleton */}
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <SkeletonLoader width={180} height={30} style={{ marginBottom: 8 }} />
          <SkeletonLoader width={250} height={18} />
        </View>

        {/* Near Branch List Skeleton */}
        <View style={{ width: "100%" }}>
          <SkeletonLoader width={150} height={22} style={{ marginBottom: 10 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 12, paddingVertical: 5 }}>
              {[1, 2, 3].map((_, index) => (
                <SkeletonLoader
                  key={index}
                  width={wp(42)}
                  height={hp(22)}
                  style={{ borderRadius: 12 }}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* All Branches Skeleton */}
        <View style={{ width: "100%" }}>
          <SkeletonLoader width={150} height={22} style={{ marginBottom: 10 }} />
          <View style={{ gap: 15, width: "100%" }}>
            {[1, 2, 3, 4].map((_, index) => (
              <SkeletonLoader
                key={index}
                width="100%"
                height={hp(12)}
                style={{ borderRadius: 12 }}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    // height: hp('100%'),
    alignItems: "flex-start",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(2.5),
    gap: 20,
  },
  
});


export default LocationSkeleton;