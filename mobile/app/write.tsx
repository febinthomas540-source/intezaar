import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const arrivals = [
  { label: "12 hours", note: "Intezaar Express", hours: 12 },
  { label: "Tomorrow", note: "Priority arrival", hours: 24 },
  { label: "3 days", note: "A short wait", hours: 72 },
  { label: "5 days", note: "A meaningful pause", hours: 120 },
  { label: "7 days", note: "A slower arrival", hours: 168 },
];

export default function WriteScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [hours, setHours] = useState(120);

  const arrival = useMemo(() => {
    const value = new Date(Date.now() + hours * 60 * 60 * 1000);
    return value.toLocaleString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  }, [hours]);

  async function next() {
    await Haptics.selectionAsync();
    setStep((current) => Math.min(2, current + 1));
  }

  async function previewSeal() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: "/posted",
        params: {
          recipient: recipient.trim() || "Someone special",
          arrival,
        },
      });
    }, 280);
  }

  const canContinue = sender.trim().length > 0 && recipient.trim().length > 0 && message.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => step === 0 ? router.back() : setStep((value) => value - 1)}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Write a letter</Text>
            <Text style={styles.headerMeta}>STEP {step + 1} OF 3</Text>
          </View>
          <View style={styles.headerSeal}><Text style={styles.headerSealText}>I</Text></View>
        </View>

        <View style={styles.progress}>
          {[0, 1, 2].map((item) => <View key={item} style={[styles.progressBar, item <= step && styles.progressActive]} />)}
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {step === 0 ? (
            <>
              <Text style={styles.eyebrow}>PUT THE WORDS FIRST</Text>
              <Text style={styles.title}>What do you want them to receive?</Text>
              <Text style={styles.copy}>No chat bubbles. No typing indicator. Just one letter.</Text>

              <View style={styles.row}>
                <View style={styles.fieldHalf}>
                  <Text style={styles.label}>From</Text>
                  <TextInput style={styles.input} value={sender} onChangeText={setSender} placeholder="Your name" placeholderTextColor="#A78C7D" />
                </View>
                <View style={styles.fieldHalf}>
                  <Text style={styles.label}>To</Text>
                  <TextInput style={styles.input} value={recipient} onChangeText={setRecipient} placeholder="Their name" placeholderTextColor="#A78C7D" />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Your letter</Text>
                <TextInput
                  style={styles.letterInput}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  textAlignVertical="top"
                  maxLength={4000}
                  placeholder="Dear you,\n\nThere is something I wanted to say properly…"
                  placeholderTextColor="#A78C7D"
                />
                <Text style={styles.counter}>{message.length.toLocaleString()} / 4,000</Text>
              </View>

              <Pressable disabled={!canContinue} style={({ pressed }) => [styles.primary, !canContinue && styles.disabled, pressed && canContinue && styles.pressed]} onPress={next}>
                <Text style={styles.primaryText}>Choose when it arrives</Text>
              </Pressable>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Text style={styles.eyebrow}>THE WAIT IS PART OF IT</Text>
              <Text style={styles.title}>When should this letter arrive?</Text>
              <Text style={styles.copy}>Until that moment, the recipient sees a sealed letter — not the words inside.</Text>

              <View style={styles.arrivalGrid}>
                {arrivals.map((item) => {
                  const active = hours === item.hours;
                  return (
                    <Pressable
                      key={item.hours}
                      style={({ pressed }) => [styles.arrivalCard, active && styles.arrivalCardActive, pressed && styles.pressed]}
                      onPress={async () => {
                        setHours(item.hours);
                        await Haptics.selectionAsync();
                      }}
                    >
                      <Text style={[styles.arrivalLabel, active && styles.arrivalLabelActive]}>{item.label}</Text>
                      <Text style={[styles.arrivalNote, active && styles.arrivalNoteActive]}>{item.note}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.deliveryCard}>
                <Text style={styles.deliverySmall}>CHOSEN ARRIVAL</Text>
                <Text style={styles.deliveryDate}>{arrival}</Text>
                <View style={styles.routeLine}>
                  <Text style={styles.city}>Delhi</Text>
                  <Text style={styles.route}>──── 🚂 ────</Text>
                  <Text style={styles.city}>Kochi</Text>
                </View>
                <Text style={styles.routeNote}>The journey is cinematic, not live postal or railway tracking.</Text>
              </View>

              <Pressable style={({ pressed }) => [styles.primary, pressed && styles.pressed]} onPress={next}>
                <Text style={styles.primaryText}>Seal the letter</Text>
              </Pressable>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Text style={styles.eyebrow}>ONE LAST MOMENT</Text>
              <Text style={styles.title}>Ready to seal it?</Text>
              <Text style={styles.copy}>Once the production backend is connected, this is where the encrypted posting ceremony completes.</Text>

              <View style={styles.previewCard}>
                <Text style={styles.previewTo}>FOR {recipient.toUpperCase()}</Text>
                <Text style={styles.previewOpening}>Dear {recipient || "you"},</Text>
                <Text style={styles.previewMessage} numberOfLines={8}>{message}</Text>
                <View style={styles.previewEnvelope}>
                  <View style={styles.previewFlap} />
                  <View style={styles.wax}><Text style={styles.waxText}>I</Text></View>
                </View>
                <Text style={styles.previewArrival}>ARRIVES · {arrival.toUpperCase()}</Text>
              </View>

              <Pressable style={({ pressed }) => [styles.sealButton, pressed && styles.pressed]} onPress={previewSeal}>
                <View style={styles.buttonWax}><Text style={styles.buttonWaxText}>I</Text></View>
                <View>
                  <Text style={styles.sealButtonText}>Press the seal</Text>
                  <Text style={styles.sealButtonNote}>Native haptic ceremony</Text>
                </View>
              </Pressable>
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5EDDF" },
  header: { height: 74, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#E1D2BE" },
  back: { width: 42, fontSize: 42, lineHeight: 44, color: "#56362A" },
  headerTitleWrap: { flex: 1, alignItems: "center" },
  headerTitle: { fontFamily: "serif", fontSize: 20, color: "#422A21" },
  headerMeta: { marginTop: 2, fontSize: 8, color: "#9B4034", fontWeight: "900", letterSpacing: 1.6 },
  headerSeal: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "#8F2F24" },
  headerSealText: { fontFamily: "serif", color: "#F3CFA3", fontSize: 16 },
  progress: { flexDirection: "row", gap: 6, paddingHorizontal: 22, paddingTop: 12 },
  progressBar: { flex: 1, height: 3, borderRadius: 3, backgroundColor: "#D8C7B0" },
  progressActive: { backgroundColor: "#96352A" },
  content: { padding: 22, paddingBottom: 52 },
  eyebrow: { marginTop: 12, fontSize: 10, fontWeight: "900", color: "#9A392E", letterSpacing: 2 },
  title: { marginTop: 10, fontFamily: "serif", fontSize: 39, lineHeight: 43, color: "#3F281F", letterSpacing: -0.9 },
  copy: { marginTop: 12, fontSize: 15, lineHeight: 23, color: "#7A5B4D" },
  row: { flexDirection: "row", gap: 12, marginTop: 26 },
  fieldHalf: { flex: 1 },
  field: { marginTop: 18 },
  label: { marginBottom: 8, fontSize: 10, fontWeight: "900", color: "#6B493B", letterSpacing: 1.3, textTransform: "uppercase" },
  input: { minHeight: 54, paddingHorizontal: 15, borderRadius: 15, borderWidth: 1, borderColor: "#DECBB0", backgroundColor: "#FFF9F0", color: "#422A21", fontSize: 16 },
  letterInput: { minHeight: 290, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: "#D9C3A4", backgroundColor: "#FFF9F0", color: "#432B22", fontFamily: "serif", fontSize: 18, lineHeight: 29 },
  counter: { marginTop: 7, textAlign: "right", fontSize: 11, color: "#9A8072" },
  primary: { marginTop: 24, minHeight: 58, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#8F2F24" },
  primaryText: { color: "#FFF4E6", fontSize: 15, fontWeight: "900" },
  disabled: { opacity: 0.38 },
  pressed: { opacity: 0.84, transform: [{ scale: 0.99 }] },
  arrivalGrid: { marginTop: 24, gap: 10 },
  arrivalCard: { minHeight: 72, borderRadius: 18, borderWidth: 1, borderColor: "#DDC8AB", backgroundColor: "#FFF9F0", padding: 16, justifyContent: "center" },
  arrivalCardActive: { backgroundColor: "#8F2F24", borderColor: "#8F2F24" },
  arrivalLabel: { fontFamily: "serif", fontSize: 21, color: "#493027" },
  arrivalLabelActive: { color: "#FFF5E8" },
  arrivalNote: { marginTop: 3, fontSize: 12, color: "#8A6A5A" },
  arrivalNoteActive: { color: "#EBCDBB" },
  deliveryCard: { marginTop: 20, padding: 20, borderRadius: 22, backgroundColor: "#E8D1AF" },
  deliverySmall: { fontSize: 9, fontWeight: "900", letterSpacing: 1.8, color: "#94362B" },
  deliveryDate: { marginTop: 7, fontFamily: "serif", fontSize: 25, color: "#4A3025" },
  routeLine: { marginTop: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  city: { fontFamily: "serif", fontSize: 16, color: "#5A3C2F" },
  route: { fontSize: 11, color: "#835743" },
  routeNote: { marginTop: 15, fontSize: 11, lineHeight: 17, color: "#846655" },
  previewCard: { marginTop: 24, borderRadius: 26, backgroundColor: "#FFF9F0", borderWidth: 1, borderColor: "#DFC9AA", padding: 22, overflow: "hidden" },
  previewTo: { fontSize: 9, fontWeight: "900", letterSpacing: 2, color: "#9A392E" },
  previewOpening: { marginTop: 20, fontFamily: "serif", fontSize: 23, color: "#452D23" },
  previewMessage: { marginTop: 14, minHeight: 130, fontFamily: "serif", fontSize: 16, lineHeight: 25, color: "#65483B" },
  previewEnvelope: { marginTop: 18, height: 150, borderRadius: 16, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: "#E9CAA1" },
  previewFlap: { position: "absolute", top: -82, width: 250, height: 170, backgroundColor: "#F2DBB8", transform: [{ rotate: "45deg" }] },
  wax: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#8D2A22", borderWidth: 5, borderColor: "#B14B3E", alignItems: "center", justifyContent: "center" },
  waxText: { color: "#F3CEA0", fontFamily: "serif", fontSize: 24 },
  previewArrival: { marginTop: 16, fontSize: 9, fontWeight: "900", letterSpacing: 1.2, color: "#7E5C4D", textAlign: "center" },
  sealButton: { marginTop: 24, minHeight: 76, paddingHorizontal: 18, borderRadius: 22, backgroundColor: "#4B2D23", flexDirection: "row", alignItems: "center", gap: 14 },
  buttonWax: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#942F25", borderWidth: 4, borderColor: "#B74F40", alignItems: "center", justifyContent: "center" },
  buttonWaxText: { fontFamily: "serif", fontSize: 20, color: "#F6D4AA" },
  sealButtonText: { color: "#FFF5E8", fontFamily: "serif", fontSize: 20 },
  sealButtonNote: { marginTop: 2, color: "#D8BBA8", fontSize: 11 },
});
