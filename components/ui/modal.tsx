import * as React from "react";
import {
  Modal as ModelRNP,
  Portal,
  Text,
  Button,
  PaperProvider,
} from "react-native-paper";

const Modal = ({ text }: { text: string }) => {
  const [visible, setVisible] = React.useState(true);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  return (
    <Portal>
      <ModelRNP
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <Text>{text}</Text>
      </ModelRNP>
    </Portal>
  );
};

export default Modal;
