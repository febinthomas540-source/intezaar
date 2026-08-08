import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const trust = ["No account", "No phone number", "Private link", "Opens when chosen"];

export default function HomeScreen() {
  const router = useRouter();

  async function startLetter() {
    await Haptics.selectionAsync();
    router.push("/write");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <View>
            <Text style={styles.brand}>Intezaar</Text>
            <Text style={styles.kicker}>PRIVATE DIGITAL MAIL</Text>
          </View>
          <View style={styles.seal}><Text style={styles.sealText}>I</Text></View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>A letter worth waiting for</Text>
          <Text style={styles.title}>Some words shouldn’t arrive instantly.</Text>
          <Text style={styles.subtitle}>
            Write a private letter, choose when it arrives, seal it and let the waiting become part of the message.
          </Text>
          <Pressable style={({ pressed }) => [styles.primary, pressed && styles.pressed]} onPress={startLetter}>
            <Text style={styles.primaryText}>Write a letter</Text>
          </Pressable>
          <View style={styles.trustRow}>
            {trust.map((item) => <Text key={item} style={styles.trustItem}>• {item}</Text>)}
          </View>
        </View>

        <View style={styles.envelopeCard}>
          <Text style={styles.cardLabel}>YOUR LETTER JOURNEY</Text>
          <View style={styles.routeRow}>
            <View><Text style={styles.routeCity}>Delhi</Text><Text style={styles.routeSmall}>POSTED FROM</Text></View>
            <Text style={styles.train}>✦ ─── 🚂 ─── ✦</Text>
            <View style={styles.routeRight}><Text style={styles.routeCity}>Kochi</Text><Text style={styles.routeSmall}>ARRIVES IN</Text></View>
          </View>
          <View style={styles.envelope}>
            <View style={styles.flap} />
            <View style={styles.wax}><Text style={styles.waxText}>I</Text></View>
            <Text style={styles.envelopeText}>SEALED UNTIL THE CHOSEN MOMENT</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>HOME</Text>
          <Text style={styles.sectionTitle}>Letters in motion</Text>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>✉</Text>
            <Text style={styles.emptyTitle}>No letters travelling yet.</Text>
            <Text style={styles.emptyText}>When you post one, its journey and arrival will live here.</Text>
          </View>
        </View>

        <View style={styles.steps}>
          {[
            ["01", "Write", "Put the words first."],
            ["02", "Choose", "Pick the opening moment."],
            ["03", "Seal", "Post it and let it wait."],
          ].map(([number, title, copy]) => (
            <View key={number} style={styles.step}>
              <Text style={styles.stepNumber}>{number}</Text>
              <View style={styles.stepCopy}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepText}>{copy}</Text></View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5EDDF" },
  content: { padding: 22, paddingBottom: 48, gap: 24 },
  topbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  brand: { fontFamily: "serif", fontSize: 30, color: "#452B21", letterSpacing: 0.3 },
  kicker: { marginTop: 2, fontSize: 9, fontWeight: "800", color: "#9A3B30", letterSpacing: 2.1 },
  seal: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#8F2F24", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#B95B4C" },
  sealText: { color: "#F6D8B0", fontFamily: "serif", fontSize: 21 },
  hero: { paddingTop: 18 },
  eyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 2.1, color: "#A23A2E", textTransform: "uppercase" },
  title: { marginTop: 14, fontFamily: "serif", fontSize: 48, lineHeight: 50, color: "#3F281F", letterSpacing: -1.5 },
  subtitle: { marginTop: 18, fontSize: 17, lineHeight: 27, color: "#745649" },
  primary: { marginTop: 26, minHeight: 58, borderRadius: 18, backgroundColor: "#8F2F24", alignItems: "center", justifyContent: "center", shadowColor: "#5E2019", shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  primaryText: { color: "#FFF5E7", fontSize: 16, fontWeight: "900", letterSpacing: 0.2 },
  trustRow: { marginTop: 16, flexDirection: "row", flexWrap: "wrap", gap: 9 },
  trustItem: { color: "#7D6152", fontSize: 12 },
  envelopeCard: { borderRadius: 28, padding: 20, backgroundColor: "#E9D3B3", borderWidth: 1, borderColor: "#D8BB92" },
  cardLabel: { fontSize: 9, fontWeight: "900", letterSpacing: 2, color: "#8F2F24" },
  routeRow: { marginTop: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  routeRight: { alignItems: "flex-end" },
  routeCity: { fontFamily: "serif", fontSize: 20, color: "#4C3024" },
  routeSmall: { marginTop: 3, fontSize: 8, color: "#8A6A58", fontWeight: "800", letterSpacing: 1.2 },
  train: { color: "#70402E", fontSize: 12 },
  envelope: { marginTop: 24, height: 180, borderRadius: 14, backgroundColor: "#F5DFC0", overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#D6AF7E" },
  flap: { position: "absolute", top: -68, width: 260, height: 150, backgroundColor: "#E8C89D", transform: [{ rotate: "45deg" }] },
  wax: { width: 62, height: 62, borderRadius: 31, backgroundColor: "#922D24", borderWidth: 5, borderColor: "#B64D3D", alignItems: "center", justifyContent: "center", zIndex: 3 },
  waxText: { color: "#F4CFA0", fontFamily: "serif", fontSize: 25 },
  envelopeText: { marginTop: 18, zIndex: 3, fontSize: 9, color: "#6A4939", fontWeight: "900", letterSpacing: 1.5 },
  section: { marginTop: 2 },
  sectionEyebrow: { fontSize: 10, fontWeight: "900", letterSpacing: 2, color: "#A23A2E" },
  sectionTitle: { marginTop: 7, fontFamily: "serif", fontSize: 34, color: "#402A21" },
  emptyCard: { marginTop: 14, padding: 22, borderRadius: 22, backgroundColor: "#FFF9F0", borderWidth: 1, borderColor: "#E7D8C3" },
  emptyIcon: { fontSize: 28, color: "#8F2F24" },
  emptyTitle: { marginTop: 10, fontFamily: "serif", fontSize: 21, color: "#4B3025" },
  emptyText: { marginTop: 7, fontSize: 14, lineHeight: 21, color: "#806456" },
  steps: { gap: 10 },
  step: { flexDirection: "row", gap: 15, alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#DFD0BC" },
  stepNumber: { width: 34, fontSize: 10, fontWeight: "900", color: "#A23A2E", letterSpacing: 1.4 },
  stepCopy: { flex: 1 },
  stepTitle: { fontFamily: "serif", fontSize: 20, color: "#493026" },
  stepText: { marginTop: 2, fontSize: 13, color: "#806457" },
});
