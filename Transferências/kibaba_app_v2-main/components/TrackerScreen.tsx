import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"

const TrackerScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.trackerCard}>
        <Text style={styles.trackerTitle}>Como você está se sentindo hoje?</Text>
        {/* Add your symptom and mood tracking components here */}
        <View style={styles.trackerContent}>
          {/* Example content - replace with actual tracker components */}
          <Text>Selecione seus sintomas e humor:</Text>
          {/* End example content */}
          <View style={styles.trackerActions}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                // Here you would typically save the data to your state management or backend
                // For now, we'll just show a notification
                Alert.alert("Registrado com sucesso", "Seus sintomas e humor foram registrados para hoje.", [
                  { text: "OK" },
                ])
              }}
            >
              <Text style={styles.saveButtonText}>Salvar registro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    padding: 20,
    justifyContent: "center",
  },
  trackerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trackerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#388E3C",
    textAlign: "center",
  },
  trackerContent: {
    // Style the content area as needed
  },
  trackerActions: {
    marginTop: 20,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#F9A826",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
})

export default TrackerScreen

