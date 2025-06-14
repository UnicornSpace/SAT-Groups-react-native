// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import {
//   Card,
//   Text,
//   ProgressBar,
//   Surface,
//   Button,
//   ActivityIndicator,
//   useTheme,
//   IconButton,
// } from 'react-native-paper';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
//   withSpring,
//   withDelay,
//   interpolate,
//   runOnJS,
//   FadeIn,
//   SlideInLeft,
//   SlideInRight,
//   BounceIn,
//   ZoomIn,
//   withSequence,
// } from 'react-native-reanimated';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// // Types
// interface MilestoneData {
//   id: string;
//   requiredPoints: string;
//   rewardPoints: string;
//   rewardType: 'Points' | 'Gift';
//   status: 'claimed' | 'unclaimed' | 'locked';
//   position: number;
// }

// interface ApiResponse {
//   status: string;
//   totalPoints: number;
//   mileStones: MilestoneData[];
// }

// interface MilestonePathProps {
//   apiData?: ApiResponse;
//   onMilestoneClaim?: (milestoneId: string) => void;
//   isLoading?: boolean;
// }

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// const AnimatedCard = Animated.createAnimatedComponent(Card);
// const AnimatedSurface = Animated.createAnimatedComponent(Surface);

// const MilestoneComponent: React.FC<MilestonePathProps> = ({
//   apiData,
//   onMilestoneClaim,
//   isLoading = false,
// }) => {
//   const theme = useTheme();
//   const scrollRef = useRef<ScrollView>(null);
  
//   // Animation values
//   const progressAnimation = useSharedValue(0);
//   const pathAnimation = useSharedValue(0);
//   const milestoneAnimations = useRef<{ [key: string]: any }>({});
  
//   // State
//   const [animationComplete, setAnimationComplete] = useState(false);
  
//   // Data processing
//   const userPoints = apiData?.totalPoints || 0;
//   const milestones = apiData?.mileStones || [];
  
//   const processedMilestones = milestones
//     .sort((a, b) => a.position - b.position)
//     .map((milestone, index) => {
//       const requiredPoints = parseInt(milestone.requiredPoints);
//       const isAchieved = userPoints >= requiredPoints;
//       const canClaim = isAchieved && milestone.status === 'unclaimed';
//       const isClaimed = milestone.status === 'claimed';
      
//       // Initialize animation values for each milestone
//       if (!milestoneAnimations.current[milestone.id]) {
//         milestoneAnimations.current[milestone.id] = {
//           scale: useSharedValue(0),
//           rotation: useSharedValue(0),
//           opacity: useSharedValue(0),
//         };
//       }
      
//       return {
//         ...milestone,
//         requiredPoints,
//         isAchieved,
//         canClaim,
//         isClaimed,
//         isStart: index === 0,
//         index,
//       };
//     });

//   // Calculate progress
//   const getCurrentProgress = () => {
//     if (processedMilestones.length === 0) return { progress: 0, nextMilestone: null };
    
//     const nextMilestone = processedMilestones.find(m => !m.isAchieved);
//     if (!nextMilestone) {
//       return { progress: 1, nextMilestone: null, message: 'All milestones completed!' };
//     }
    
//     const currentIndex = processedMilestones.indexOf(nextMilestone);
//     const previousMilestone = currentIndex > 0 ? processedMilestones[currentIndex - 1] : null;
    
//     if (!previousMilestone) {
//       const progress = userPoints / nextMilestone.requiredPoints;
//       return {
//         progress: Math.min(1, progress),
//         nextMilestone,
//         message: `${Math.round(progress * 100)}% to ${nextMilestone.requiredPoints} points`
//       };
//     }
    
//     const segmentProgress = (userPoints - previousMilestone.requiredPoints) / 
//                            (nextMilestone.requiredPoints - previousMilestone.requiredPoints);
    
//     return {
//       progress: Math.min(1, Math.max(0, segmentProgress)),
//       nextMilestone,
//       message: `${Math.round(segmentProgress * 100)}% to ${nextMilestone.requiredPoints} points`
//     };
//   };

//   const currentProgress = getCurrentProgress();

//   // Animation effects
//   useEffect(() => {
//     if (!isLoading && processedMilestones.length > 0) {
//       // Animate progress bar
//       progressAnimation.value = withTiming(currentProgress.progress, {
//         duration: 1500,
//       });

//       // Animate path
//       pathAnimation.value = withTiming(1, {
//         duration: 2000,
//       });

//       // Animate milestones with stagger
//       processedMilestones.forEach((milestone, index) => {
//         const animations = milestoneAnimations.current[milestone.id];
//         if (animations) {
//           animations.opacity.value = withDelay(
//             index * 200,
//             withTiming(1, { duration: 500 })
//           );
//           animations.scale.value = withDelay(
//             index * 200,
//             withSpring(1, { damping: 15, stiffness: 150 })
//           );
          
//           if (milestone.canClaim) {
//             animations.rotation.value = withDelay(
//               index * 200 + 500,
//               withSpring(360, { damping: 10, stiffness: 100 })
//             );
//           }
//         }
//       });

//       // Set animation complete after all animations
//       setTimeout(() => {
//         runOnJS(setAnimationComplete)(true);
//       }, processedMilestones.length * 200 + 2000);
//     }
//   }, [isLoading, userPoints, processedMilestones.length]);

//   // Get milestone icon
//   const getMilestoneIcon = (milestone: any): string => {
//     if (milestone.isStart) return 'rocket-launch';
//     if (milestone.isClaimed) return 'check-circle';
//     if (milestone.canClaim) return 'gift';
//     if (milestone.rewardType === 'Gift') return 'gift-outline';
//     return 'coin';
//   };

//   // Get milestone color
//   const getMilestoneColor = (milestone: any): string => {
//     if (milestone.isClaimed) return theme.colors.primary;
//     if (milestone.canClaim) return theme.colors.secondary;
//     if (milestone.isAchieved) return theme.colors.tertiary;
//     return theme.colors.outline;
//   };

//   // Handle milestone claim with animation
//   const handleClaim = (milestoneId: string) => {
//     const animations = milestoneAnimations.current[milestoneId];
//     if (animations) {
//       animations.scale.value = withSequence(
//         withTiming(1.2, { duration: 100 }),
//         withTiming(1, { duration: 100 })
//       );
//     }
//     onMilestoneClaim?.(milestoneId);
//   };

//   // Animated styles
//   const progressBarStyle = useAnimatedStyle(() => ({
//     width: `${interpolate(progressAnimation.value, [0, 1], [0, 100])}%`,
//   }));

//   const pathStyle = useAnimatedStyle(() => ({
//     opacity: pathAnimation.value,
//     transform: [
//       {
//         scaleY: interpolate(pathAnimation.value, [0, 1], [0, 1]),
//       },
//     ],
//   }));

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//         <Text style={styles.loadingText}>Loading milestones...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Fixed Progress Header */}
//       <Animated.View 
//         style={styles.headerContainer}
//         entering={SlideInLeft.duration(800)}
//       >
//         <LinearGradient
//           colors={[theme.colors.primary, theme.colors.secondary]}
//           style={styles.headerGradient}
//         >
//           <Card style={styles.progressCard}>
//             <Card.Content>
//               <Text variant="headlineSmall" style={styles.pointsText}>
//                 🏆 {userPoints} Points
//               </Text>
//               <Text variant="bodyMedium" style={styles.progressText}>
//                 {currentProgress.message}
//               </Text>
//               <View style={styles.progressContainer}>
//                 <View style={styles.progressTrack}>
//                   <Animated.View
//                     style={[styles.progressFill, progressBarStyle]}
//                   />
//                 </View>
//               </View>
//             </Card.Content>
//           </Card>
//         </LinearGradient>
//       </Animated.View>

//       {/* Scrollable Milestones */}
//       <ScrollView
//         ref={scrollRef}
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.milestonesContainer}>
//           {/* Connection Path */}
//           <Animated.View style={[styles.pathContainer, pathStyle]}>
//             <LinearGradient
//               colors={[theme.colors.primary, theme.colors.secondary]}
//               style={styles.pathGradient}
//             />
//           </Animated.View>

//           {/* Milestones */}
//           {processedMilestones.map((milestone, index) => {
//             const animations = milestoneAnimations.current[milestone.id];
            
//             const milestoneStyle = useAnimatedStyle(() => ({
//               opacity: animations?.opacity.value || 0,
//               transform: [
//                 { scale: animations?.scale.value || 0 },
//                 { rotate: `${animations?.rotation.value || 0}deg` },
//               ],
//             }));

//             const isLeft = index % 2 === 0;
//             const AnimationComponent = isLeft ? SlideInLeft : SlideInRight;

//             return (
//               <View key={milestone.id} style={styles.milestoneRow}>
//                 {/* Left side milestone */}
//                 {isLeft && (
//                   <AnimatedSurface
//                     style={[styles.milestoneSurface, milestoneStyle]}
//                     elevation={milestone.canClaim ? 8 : 4}
//                   >
//                     <MilestoneCard
//                       milestone={milestone}
//                       theme={theme}
//                       onClaim={handleClaim}
//                       getMilestoneIcon={getMilestoneIcon}
//                       getMilestoneColor={getMilestoneColor}
//                     />
//                   </AnimatedSurface>
//                 )}

//                 {/* Center circle */}
//                 <AnimatedSurface
//                   style={[
//                     styles.centerCircle,
//                     { backgroundColor: getMilestoneColor(milestone) },
//                     milestoneStyle,
//                   ]}
//                   elevation={6}
//                 >
//                   <MaterialCommunityIcons
//                     name={getMilestoneIcon(milestone) as any}
//                     size={milestone.isStart ? 32 : 24}
//                     color="white"
//                   />
//                 </AnimatedSurface>

//                 {/* Right side milestone */}
//                 {!isLeft && (
//                   <AnimatedSurface
//                     style={[styles.milestoneSurface, milestoneStyle]}
//                     elevation={milestone.canClaim ? 8 : 4}
//                   >
//                     <MilestoneCard
//                       milestone={milestone}
//                       theme={theme}
//                       onClaim={handleClaim}
//                       getMilestoneIcon={getMilestoneIcon}
//                       getMilestoneColor={getMilestoneColor}
//                     />
//                   </AnimatedSurface>
//                 )}
//               </View>
//             );
//           })}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// // Milestone Card Component
// const MilestoneCard: React.FC<{
//   milestone: any;
//   theme: any;
//   onClaim: (id: string) => void;
//   getMilestoneIcon: (milestone: any) => string;
//   getMilestoneColor: (milestone: any) => string;
// }> = ({ milestone, theme, onClaim, getMilestoneIcon, getMilestoneColor }) => {
//   return (
//     <Card style={[styles.milestoneCard, { borderColor: getMilestoneColor(milestone) }]}>
//       <Card.Content style={styles.cardContent}>
//         <View style={styles.cardHeader}>
//           <Text variant="titleMedium" style={styles.pointsLabel}>
//             {milestone.requiredPoints} Points
//           </Text>
//           {milestone.isClaimed && (
//             <MaterialCommunityIcons
//               name="check-circle"
//               size={20}
//               color={theme.colors.primary}
//             />
//           )}
//         </View>
        
//         <View style={styles.rewardContainer}>
//           <MaterialCommunityIcons
//             name={getMilestoneIcon(milestone) as any}
//             size={24}
//             color={getMilestoneColor(milestone)}
//           />
//           <Text variant="bodyMedium" style={styles.rewardText}>
//             {milestone.rewardType === 'Gift' 
//               ? 'Special Gift' 
//               : `+${milestone.rewardPoints} Points`
//             }
//           </Text>
//         </View>

//         {milestone.canClaim && (
//           <Animated.View entering={BounceIn.delay(1000)}>
//             <Button
//               mode="contained"
//               onPress={() => onClaim(milestone.id)}
//               style={styles.claimButton}
//               icon="gift"
//             >
//               Claim Reward
//             </Button>
//           </Animated.View>
//         )}
//       </Card.Content>
//     </Card>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   headerContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 100,
//     elevation: 10,
//   },
//   headerGradient: {
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//     paddingBottom: 10,
//     paddingHorizontal: 16,
//   },
//   progressCard: {
//     borderRadius: 16,
//   },
//   pointsText: {
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   progressText: {
//     textAlign: 'center',
//     marginBottom: 16,
//     opacity: 0.8,
//   },
//   progressContainer: {
//     marginTop: 8,
//   },
//   progressTrack: {
//     height: 8,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#4CAF50',
//     borderRadius: 4,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingTop: 200, // Space for fixed header
//     paddingBottom: 50,
//   },
//   milestonesContainer: {
//     paddingHorizontal: 16,
//     position: 'relative',
//   },
//   pathContainer: {
//     position: 'absolute',
//     left: SCREEN_WIDTH / 2 - 2,
//     top: 50,
//     bottom: 50,
//     width: 4,
//     zIndex: 1,
//   },
//   pathGradient: {
//     flex: 1,
//     borderRadius: 2,
//   },
//   milestoneRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 30,
//     minHeight: 100,
//   },
//   milestoneSurface: {
//     flex: 1,
//     marginHorizontal: 16,
//     borderRadius: 16,
//     zIndex: 2,
//   },
//   milestoneCard: {
//     borderWidth: 2,
//     borderRadius: 16,
//   },
//   cardContent: {
//     padding: 16,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   pointsLabel: {
//     fontWeight: 'bold',
//   },
//   rewardContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   rewardText: {
//     marginLeft: 8,
//     flex: 1,
//   },
//   claimButton: {
//     marginTop: 8,
//     borderRadius: 25,
//   },
//   centerCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 3,
//     position: 'absolute',
//     left: SCREEN_WIDTH / 2 - 30,
//   },
// });

// export default MilestoneComponent;