import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Pressable, SafeAreaView, Share, StyleSheet, Text, View } from "react-native";

export default function PostedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipient?: string; arrival?: string }>();
  const recipient = params.recipient || "Someone special";
  const arrival = params.arrival || "the chosen moment";

  async function sharePreview() {
    await Haptics.selectionAsync();
    await Share.share({
      message: `I’m preparing an Intezaar letter for ${recipient}. It is set to arrive ${arrival}.`,
      title: "Intezaar",
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.successMark}><Text style={styles.successMarkText}>I</Text></View>
        <Text style={styles.eyebrow}>NATIVE CEREMONY READY</Text>
        <Text style={styles.title}>The seal has been pressed.</Text>
        <Text style={styles.copy}>
          This first native milestone is the real Android/iOS interface. Secure production posting will be connected to the existing Intezaar backend next.
        </Text>

        <View style={styles.ticket}>
          <View style={styles.ticketTop}>
            <View><Text style={styles.ticketSmall}>PRIVATE MAIL FOR</Text><Text style={styles.ticketName}>{recipient}</Text></View>
            <View style={styles.miniSeal}><Text style={styles.miniSealText}>I</Text></View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.ticketSmall}>ARRIVAL</Text>
          <Text style={styles.arrival}>{arrival}</Text>
          <View style={styles.route}><Text style={styles.city}>Delhi</Text><Text style={styles.rail}>─── 🚂 ───</Text><Text style={styles.city}>Kochi</Text></View>
        </View>

        <Pressable style={({ pressed }) => [styles.primary, pressed && styles.pressed]} onPress={sharePreview}>
          <Text style={styles.primaryText}>Share preview</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.secondary, pressed && styles.pressed]} onPress={() => router.replace("/")}>
          <Text style={styles.secondaryText}>Back to home</Text>
        </Pressable>

        <Text style={styles.note}>No production letter was created by this prototype screen.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5EDDF" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  successMark: { width: 82, height: 82, borderRadius: 41, alignSelf: "center", backgroundColor: "#8F2F24", borderWidth: 6, borderColor: "#B44D3F", alignItems: "center", justifyContent: "center" },
  successMarkText: { fontFamily: "serif", fontSize: 34, color: "#F5D1A5" },
  eyebrow: { marginTop: 26, textAlign: "center", fontSize: 9, fontWeight: "900", letterSpacing: 2.1, color: "#9A3A2E" },
  title: { marginTop: 10, textAlign: "center", fontFamily: "serif", fontSize: 39, lineHeight: 43, color: "#40291F", letterSpacing: -0.9 },
  copy: { marginTop: 14, textAlign: "center", fontSize: 14, lineHeight: 22, color: "#76584A" },
  ticket: { marginTop: 28, padding: 21, borderRadius: 24, backgroundColor: "#FFF9F0", borderWidth: 1, borderColor: "#DDC7A8" },
  ticketTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ticketSmall: { fontSize: 8, fontWeight: "900", letterSpacing: 1.7, color: "#9A3A2E" },
  ticketName: { marginTop: 4, fontFamily: "serif", fontSize: 24, color: "#4A3025" },
  miniSeal: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#8F2F24", alignItems: "center", justifyContent: "center" },
  miniSealText: { fontFamily: "serif", fontSize: 18, color: "#F1CAA0" },
  divider: { height: 1, backgroundColor: "#E6D6C0", marginVertical: 18 },
  arrival: { marginTop: 5, fontFamily: "serif", fontSize: 21, color: "#4C3126" },
  route: { marginTop: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  city: { fontFamily: "serif", fontSize: 16, color: "#5B3B2F" },
  rail: { fontSize: 11, color: "#815644" },
  primary: { marginTop: 22, minHeight: 56, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#8F2F24" },
  primaryText: { color: "#FFF4E7", fontSize: 15, fontWeight: "900" },
  secondary: { marginTop: 10, minHeight: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#D9C5AA" },
  secondaryText: { color: "#5E4033", fontSize: 14, fontWeight: "800" },
  pressed: { opacity: 0.84, transform: [{ scale: 0.99 }] },
  note: { marginTop: 14, textAlign: "center", fontSize: 10, color: "#9A8274" },
});
