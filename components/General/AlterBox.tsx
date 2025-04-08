import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomAlert = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Open Modal Button */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Show Alert</Text>
      </TouchableOpacity>

      {/* Custom Alert Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            <Text style={styles.title}>Custom Alert</Text>
            <Text style={styles.message}>This is a custom alert message!</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, styles.okButton]}>
                <Text style={styles.okText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 5 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },

  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  alertBox: { width: 300, backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  message: { fontSize: 16, marginBottom: 20 },

  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  modalButton: { flex: 1, padding: 10, alignItems: "center", borderRadius: 5, marginHorizontal: 5 },
  cancelButton: { backgroundColor: "gray" },
  okButton: { backgroundColor: "blue" },
  cancelText: { color: "white", fontSize: 16 },
  okText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
