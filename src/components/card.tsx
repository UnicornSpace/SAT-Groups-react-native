import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Gift } from "lucide-react";

const BalanceCard = () => {
  return (
    <View>
      <Card className="w-full  bg-white border-0 rounded-3xl">
        <CardHeader className="flex flex-row items-center gap-32">
          <View className="flex flex-col-reverse">
            <CardTitle className="text-[#202020] text-4xl font-SpaceGroteskBold ">320.000</CardTitle>
          <CardDescription className="text-[#909294] text-xl font-SpaceGroteskMedium tracking-tighter">
            Your Points
          </CardDescription>
          </View>
          <View className="mt-3">
            {/* <Gift strokeWidth={2} size={30} color={"#202020"} /> */}
            <EyeOff strokeWidth={2} size={20} color={"#202020"} />
          </View>
        </CardHeader>
        <CardContent className="mt-[-10px]">
          <Button className="rounded-full " size={"default"} variant={"secondary"}>
            <Text className="text-white font-SpaceGroteskSemibold text-xl">Redeem</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
};

export default BalanceCard;

const styles = StyleSheet.create({});
