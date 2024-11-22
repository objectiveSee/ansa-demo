import { FC, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity } from "react-native"
import { Text } from "../components"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "../theme"
import { useAppTheme } from "../utils/useAppTheme"
import { getCustomer, ManagedAnasaBalanceScreen } from "ansa-react-native"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"

// TODO: Remove hardcoded ID after testing
const customerId = "20b7d15d-4ac8-4925-840e-624ea69e4599"
const merchantId = "3a8528eb-d0d5-46b6-9adb-62f669de55e5"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = () => {
  const { themed } = useAppTheme()
  const [result, setResult] = useState<string | null>(null)
  const [showWallet, setShowWallet] = useState(false)
  const $containerInsets = useSafeAreaInsetsStyle(["top", "bottom"])

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

  if (showWallet) {
    return (
      <View style={[themed($walletContainer), $containerInsets]}>
        <View style={themed($walletContent)}>
          <ManagedAnasaBalanceScreen
            style={themed($balanceScreen)}
            customerId={customerId}
            merchantId={merchantId}
          />
          <TouchableOpacity style={themed($closeButton)} onPress={() => setShowWallet(false)}>
            <Text style={themed($closeButtonText)}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={[themed($container), $containerInsets]}>
      <TouchableOpacity style={themed($fetchButton)} onPress={fetchCustomer}>
        <Text style={themed($buttonText)}>Fetch Customer Info</Text>
      </TouchableOpacity>

      <TouchableOpacity style={themed($fetchButton)} onPress={() => setShowWallet(true)}>
        <Text style={themed($buttonText)}>Show Wallet</Text>
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

const $walletContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "white",
})

const $walletContent: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  position: "relative",
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

const $balanceScreen: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $closeButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  right: spacing.sm,
  top: spacing.sm,
  zIndex: 999,
  padding: spacing.xs,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: 15,
  width: 30,
  height: 30,
  alignItems: "center",
  justifyContent: "center",
})

const $closeButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 20,
  color: colors.text,
})
