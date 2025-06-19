import { PanResponder, PanResponderInstance } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export const createMilestonePanResponder = ({ points,
  handleMilestonePress,}:any) : PanResponderInstance =>{
    return PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => false,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

    onPanResponderGrant: (evt, gestureState) => {
      const { locationX, locationY } = evt.nativeEvent;
      // console.log("Touch coordinates:", locationX, locationY);

      // Calculate touch tolerance (responsive)
      const touchTolerance = wp(10);

      const tappedIndex = points.findIndex((point:any) => {
        const distance = Math.hypot(locationX - point.x, locationY - point.y);
        return distance < touchTolerance;
      });

      if (tappedIndex !== -1) {
        handleMilestonePress(points[tappedIndex]);
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      // Allow scrolling while still detecting taps
      return false;
    },

    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // Handle release if needed
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Handle termination if needed
    },
    onShouldBlockNativeResponder: (evt, gestureState) => false,
  });
}