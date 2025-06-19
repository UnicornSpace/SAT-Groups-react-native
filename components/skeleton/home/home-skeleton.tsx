import { useEffect, useRef } from "react";
import { Animated, ScrollView, View ,StyleSheet} from "react-native";
import { width } from "react-native-responsive-sizes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


// Skeleton Component
export const SkeletonLoader = ({ width, height, style }: any) => {
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

// Skeleton Screen
const HomeSkeleton = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* User Container Skeleton */}
        <View style={styles.userContainerSkeleton}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <SkeletonLoader
              width={50}
              height={50}
              style={{ borderRadius: 25 }}
            />
            <View>
              <SkeletonLoader
                width={120}
                height={20}
                style={{ marginBottom: 5 }}
              />
              <SkeletonLoader width={80} height={15} />
            </View>
          </View>
          <SkeletonLoader width={80} height={40} />
        </View>

        {/* Banner Skeleton */}
        <SkeletonLoader width={width(90)} height={180} />

        {/* Title Skeleton */}
        <SkeletonLoader
          width={200}
          height={24}
          style={{ marginTop: 10, marginBottom: 10 }}
        />

        {/* Tabs Skeleton */}
        <View style={{ flexDirection: "row", width: width(90), gap: 10 }}>
          <SkeletonLoader width={width(28)} height={40} />
          <SkeletonLoader width={width(28)} height={40} />
          <SkeletonLoader width={width(28)} height={40} />
        </View>

        {/* Transaction Cards Skeleton */}
        <View style={{ width: width(90), gap: 15, marginTop: 10 }}>
          <SkeletonLoader width="100%" height={70} />
          <SkeletonLoader width="100%" height={70} />
          <SkeletonLoader width="100%" height={70} />
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    alignItems: "flex-start",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(2.5),
    gap: 20,
  },
  userContainerSkeleton: {
    width: width(90),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default HomeSkeleton;