import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "react-native-paper";

const RecentTranscationCard = () => {
  return (
    <View>
      <Card className="">
        
        <CardHeader className="flex p-4 flex-row items-center justify-between">
          <View className="flex flex-row items-center  gap-3">
            <View className=" rounded-xl p-2 border border-muted">
              <Image
                source={require("@/assets/images/satgroups/noxBlue-Logo.png")}
                className="w-[32px] h-[30px] rounded-3xl"
                resizeMode="cover"
              />
            </View>
            <View className="flex flex-col">
              <Text className=" text-muted text-xl font-SpaceGroteskBold ">
                Nox Solution
              </Text>

              <Text className="text-sm  text-[#909294] tracking-tight font-SpaceGroteskRegular">
                Perundurai
              </Text>
            </View>
          </View>
          <View className="flex items-center">
            <Text className=" text-muted text-2xl  font-SpaceGroteskBold ">
              +20
            </Text>
            <Badge className="w-20 ">9th march</Badge>
          </View>
        </CardHeader>
      </Card>
    </View>
  );
};

export default RecentTranscationCard;

const styles = StyleSheet.create({});
