"use client"

import { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Icon } from "../App"
import { createNewDiscussion, createNewPost } from "../services/data-service"
import { getTagsPosts, registerSymptom, storePost, typeSymptoms } from "../services/authed/main-service"

// Paleta de cores refinada
const COLORS = {
  background: "#121212",
  card: "#1E1E1E",
  cardDark: "#181818",
  cardLight: "#252525",
  primary: "#F9A826",
  primaryLight: "rgba(249, 168, 38, 0.15)",
  primaryDark: "#E08A00",
  secondary: "#E57373",
  secondaryLight: "rgba(229, 115, 115, 0.15)",
  secondaryDark: "#C62828",
  tertiary: "#64B5F6",
  tertiaryLight: "rgba(100, 181, 246, 0.15)",
  tertiaryDark: "#1976D2",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  textTertiary: "#666666",
  border: "#333333",
  borderLight: "#444444",
  success: "#4CAF50",
  successLight: "rgba(76, 175, 80, 0.15)",
  warning: "#FFC107",
  warningLight: "rgba(255, 193, 7, 0.15)",
  error: "#F44336",
  errorLight: "rgba(244, 67, 54, 0.15)",
  highlight: "#FFFFFF",
  highlightLight: "rgba(255, 255, 255, 0.15)",
  shadow: "#000000",
}

const RegisterSymptomScreen = ({ setActiveTab }) => {

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type_symptoms, setTypeSymptoms] = useState("")
  const [currentTag, setCurrentTag] = useState("")

  const [isStory, setIsStory] = useState(false); 
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableTypeSymptoms, setAvailableTypeSymptoms] = useState([]);
  const [selectedIntensity, setSelectedIntensity] = useState("");

 /*  const screenTitle = isStory ? "Nova História" : "Nova Discussão";
  const contentPlaceholder = isStory
    ? "Compartilhe sua experiência ou história..."
    : "Faça uma pergunta ou inicie uma discussão..."; */

    useEffect(() => {
      const fetchData = async () => {
        try {
         /*  setLoading(true); */
          const data = await typeSymptoms();
          setAvailableTypeSymptoms(data.type_symptoms);
        } catch (error) {
          console.error("Erro ao buscar tipos de sintomas:", error);
        } finally {
          /* setLoading(false); */
        }
      };
     
      fetchData();
    }, []);

  // Submit the post
  const handleSubmit = async () => {
    if (!selectedIntensity.trim()) {
      Alert.alert("Erro", "Por favor, selecione uma intensidade");
      return;
    }

    if (selectedTags.length !== 1) {
      Alert.alert("Erro", "Deve ter exatamente um tipo de sintoma.");
      return;
    }

    const symptomData = {
      intensity: selectedIntensity.trim(),
      content: content.trim(),
      type_symptom: selectedTags.map((type) => type.id),
    };

    //console.log(symptomData)

    try {
      //setLoading(true);
      const response = await registerSymptom(symptomData);
      if (response.success) {
        Alert.alert("Sucesso", response.message);
        //setActiveTab("community");
        //setTitle("");
        setContent("");
        setSelectedTags([]);
        setSelectedIntensity("")
      } else {
        Alert.alert("Erro", response.message || "Erro ao registar sintoma.");
      }
    } catch (error) {
      console.error("Erro ao criar postagem:", error);
      const errorMessage = error.response?.data?.message || "Erro ao registar sintoma.";
      const errorDetails = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join("\n")
        : "Tente novamente.";
      Alert.alert(errorMessage, errorDetails);
    } finally {
      //setLoading(false);
    }
  };

  // Alternar tags selecionadas
  const toggleTag = (typeSymptom) => {
    if (isStory) {
      // Para histórias, permite múltiplas typeSymptoms
      setSelectedTags((prev) =>
        prev.some((t) => t.id === typeSymptom.id)
          ? prev.filter((t) => t.id !== typeSymptom.id)
          : [...prev, typeSymptom]
      );
    } else {
      // Para discussões, permite apenas uma typeSymptom
      setSelectedTags((prev) =>
        prev.some((t) => t.id === typeSymptom.id) ? [] : [typeSymptom]
      );
    }
  };

  const toggleIntensity = (intensity) => {
    setSelectedIntensity((prev) => (prev === intensity ? "" : intensity)); // Se já está selecionada, desmarca; caso contrário, seleciona
  };

  const intensities = ["Baixa", "Média", "Alta"];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setActiveTab('cycle') } style={styles.backButton}>
          <Icon family="Feather" name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registar Sintoma</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.publishButton}>
          <Text style={styles.publishButtonText}>Registar</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Intensidade</Text>
        </View>

        {/* Lista de intensidades disponíveis para seleção */}
        <View style={styles.tagsContainer}>
          {intensities.map((intensity) => (
            <TouchableOpacity
              key={intensity}
              style={[
                styles.radioButton,
                selectedIntensity === intensity && styles.radioButtonSelected,
              ]}
              onPress={() => toggleIntensity(intensity)}
              accessible={true}
              accessibilityLabel={intensity}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedIntensity === intensity }}
            >
              <Text
                style={[
                  styles.radioText,
                  selectedIntensity === intensity && styles.radioTextSelected,
                ]}
              >
                {intensity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      {/* Seleção de História ou Discussão */}
      {/* <View style={styles.selectContainer}>
        <Text style={styles.inputLabel}>História ou Discussão?</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioButton, isStory === true && styles.radioButtonSelected]}
            onPress={() => setIsStory(true)}
            accessible={true}
            accessibilityLabel="História"
            accessibilityRole="radio"
            accessibilityState={{ selected: isStory === true }}
          >
            <Text style={[styles.radioText, isStory === true && styles.radioTextSelected]}>História</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.radioButton, isStory === false && styles.radioButtonSelected]}
            onPress={() => setIsStory(false)}
            accessible={true}
            accessibilityLabel="Discussão"
            accessibilityRole="radio"
            accessibilityState={{ selected: isStory === false }}
          >
            <Text style={[styles.radioText, isStory === false && styles.radioTextSelected]}>Discussão</Text>
          </TouchableOpacity>
        </View>
      </View> */}

       {/* Form */}
     {/*  <View style={styles.form}> */}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nota</Text>
          <TextInput
            style={styles.contentInput}
            placeholder={"Descrição"}
            placeholderTextColor="#777777"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipos de Sintoma</Text>

          {/* Lista de tipos d sintomas disponíveis para seleção */}
          <View style={styles.tagsContainer}>
            {availableTypeSymptoms?.map((TypeSymptom) => (
              <TouchableOpacity
                key={TypeSymptom.id}
                style={[
                  styles.radioButton,
                  selectedTags.some((t) => t.id === TypeSymptom.id) && styles.radioButtonSelected,
                ]}
                onPress={() => toggleTag(TypeSymptom)}
                accessible={true}
                accessibilityLabel={TypeSymptom.tipo}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedTags.some((t) => t.id === TypeSymptom.id) }}
              >
                <Text
                  style={[
                    styles.radioText,
                    selectedTags.some((t) => t.id === TypeSymptom.id) && styles.radioTextSelected,
                  ]}
                >
                  {TypeSymptom.tipo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Exibir TypeSymptoms selecionadas */}
          {selectedTags?.length > 0 && (
            <View style={styles.selectedTagsContainer}>
              {selectedTags.map((TypeSymptom) => (
                <View key={TypeSymptom.id} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{TypeSymptom.tipo}</Text>
                  <TouchableOpacity onPress={() => toggleTag(TypeSymptom)}>
                    <Icon family="Feather" name="x" size={12} color="#E57373" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
      
     {/*  </View> */}

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  publishButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F9A826",
  },
  publishButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E1E1E",
  },
  form: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "#2A2A2A",
  },
  contentInput: {
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#FFFFFF",
    backgroundColor: "#2A2A2A",
    minHeight: 200,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "rgba(229, 115, 115, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(229, 115, 115, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#E57373",
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#FFFFFF",
    backgroundColor: "#2A2A2A",
  },
  addTagButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9A826",
    justifyContent: "center",
    alignItems: "center",
  },
  addTagButtonDisabled: {
    backgroundColor: "#3A3A3A",
  },
  bottomSpacing: {
    height: 80,
  },

  selectContainer: {
  marginTop: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 8,
  },
  radioButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  radioText: {
    color: COLORS.textSecondary,
  },
  radioTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  selectedTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  selectedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(229, 115, 115, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(229, 115, 115, 0.3)",
  },
  selectedTagText: {
    fontSize: 12,
    color: "#E57373",
    marginRight: 4,
  },
})

export default RegisterSymptomScreen
