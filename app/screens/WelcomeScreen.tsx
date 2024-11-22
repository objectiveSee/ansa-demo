import { FC, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity } from "react-native"
import { Text } from "../components"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "../theme"
import { useAppTheme } from "../utils/useAppTheme"
import { getCustomer } from "ansa-react-native"

// TODO: Remove hardcoded ID after testing
const customerId = "20b7d15d-4ac8-4925-840e-624ea69e4599"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = () => {
  const { themed } = useAppTheme()
  const [result, setResult] = useState<string | null>(null)

  const fetchCustomer = async () => {
    setResult("Loading...")
    try {
      const customer = await getCustomer(customerId)
      console.log(`[WS] 🐞 Customer data: ${JSON.stringify(customer)}`)
      setResult(JSON.stringify(customer, null, 2) || "No customer data found.")
    } catch (error) {
      console.error(`[WS] 🐞 Fetch Customer failed: ${error}`)
      setResult("Failed to fetch customer data. Please try again.")
    }
  }

  return (
    <View style={themed($container)}>
      <TouchableOpacity style={themed($fetchButton)} onPress={fetchCustomer}>
        <Text style={themed($buttonText)}>Fetch Customer Info</Text>
      </TouchableOpacity>

      {result && (
        <View style={themed($resultContainer)}>
          <Text style={themed($resultText)} text={result} />
        </View>
      )}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.lg,
  justifyContent: "center",
})

const $fetchButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 8,
  padding: spacing.sm,
  alignItems: "center",
  marginBottom: spacing.md,
})

const $buttonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontSize: 16,
  fontWeight: "bold",
})

const $resultContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: 8,
  padding: spacing.sm,
})

const $resultText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 14,
})
