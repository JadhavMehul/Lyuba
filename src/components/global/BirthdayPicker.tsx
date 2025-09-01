import { Fonts } from "@utils/Constants";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from "react-native";

type BirthdayPickerProps = {
  value?: Date | null;
  onChange: (date: Date) => void;
  minimumYear?: number;
  maximumYear?: number;
  themeColor?: string;
  placeholder?: string;
  disabled?: boolean;
};

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5; // odd number works best

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year: number, month1to12: number) {
  switch (month1to12) {
    case 2: return isLeapYear(year) ? 29 : 28;
    case 4: case 6: case 9: case 11: return 30;
    default: return 31;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type WheelProps = {
  data: number[];
  initialIndex: number;
  onSnap: (index: number) => void;
  themeColor: string;
};

function Wheel({ data, initialIndex, onSnap, themeColor }: WheelProps) {
  const listRef = useRef<FlatList<number>>(null);
  const pad = Math.floor(VISIBLE_ITEMS / 2);
  const paddedData = useMemo(() => [...Array(pad).fill(NaN), ...data, ...Array(pad).fill(NaN)], [data]);
  const [scrollIndex, setScrollIndex] = useState(initialIndex);

  useEffect(() => {
    const target = clamp(initialIndex, 0, data.length - 1);
    const offset = target * ITEM_HEIGHT;
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset, animated: false });
      setScrollIndex(target);
    });
  }, [initialIndex, data.length]);

  const onMomentumEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const rawIndex = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const idx = clamp(rawIndex, 0, data.length - 1);
    if (idx !== scrollIndex) setScrollIndex(idx);
    onSnap(idx);
  }, [data.length, onSnap, scrollIndex]);

  const getItemLayout = useCallback((_d: unknown, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, overflow: "hidden" }}>
      <FlatList
        ref={listRef}
        data={paddedData}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => {
          const isSelected = index - pad === scrollIndex;
          return (
            <View style={styles.wheelItem}>
              <Text
                style={[
                  styles.wheelText,
                  isNaN(item) && { opacity: 0 },
                  isSelected && { fontWeight: "700", color: themeColor },
                ]}
              >
                {!isNaN(item) ? item : ""}
              </Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={Platform.OS === "ios" ? "fast" : 0.98}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={onMomentumEnd}
        initialNumToRender={data.length + VISIBLE_ITEMS}
        bounces={false}
      />
      {/* Center highlight line */}
      <View pointerEvents="none" style={[styles.centerHighlight, { borderColor: themeColor, backgroundColor: `${themeColor}25` }]} />
    </View>
  );
}

export default function BirthdayPicker(props: BirthdayPickerProps) {
  const now = new Date();
  const {
    value = null,
    onChange,
    themeColor = "#FFB6C1",
    placeholder = "dd/mm/yyyy",
    disabled = false,
    minimumYear = now.getFullYear() - 100,
    maximumYear = now.getFullYear(),
  } = props;

  const years = useMemo(() => {
    const a: number[] = [];
    for (let y = maximumYear; y >= minimumYear; y--) a.push(y);
    return a;
  }, [minimumYear, maximumYear]);

  const [open, setOpen] = useState(false);
  const [selDay, setSelDay] = useState<number>(value ? value.getDate() : 1);
  const [selMonth, setSelMonth] = useState<number>(value ? value.getMonth() + 1 : 1);
  const [selYear, setSelYear] = useState<number>(value ? value.getFullYear() : years[0]);

  const maxDay = useMemo(() => daysInMonth(selYear, selMonth), [selYear, selMonth]);
  useEffect(() => {
    if (selDay > maxDay) setSelDay(maxDay);
  }, [maxDay, selDay]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => Array.from({ length: maxDay }, (_, i) => i + 1), [maxDay]);

  const initDayIdx = useMemo(() => clamp(selDay - 1, 0, days.length - 1), [selDay, days.length]);
  const initMonthIdx = useMemo(() => clamp(selMonth - 1, 0, 11), [selMonth]);
  const initYearIdx = useMemo(() => years.indexOf(selYear) >= 0 ? years.indexOf(selYear) : 0, [years, selYear]);

  const displayText = value
    ? `${pad2(value.getDate())}/${pad2(value.getMonth() + 1)}/${value.getFullYear()}`
    : placeholder;

  const openModal = () => {
    if (disabled) return;
    if (value) {
      setSelDay(value.getDate());
      setSelMonth(value.getMonth() + 1);
      setSelYear(value.getFullYear());
    } else {
      const d = new Date();
      const safeYear = clamp(d.getFullYear(), minimumYear, maximumYear);
      setSelYear(safeYear);
      setSelMonth(d.getMonth() + 1);
      setSelDay(clamp(d.getDate(), 1, daysInMonth(safeYear, d.getMonth() + 1)));
    }
    setOpen(true);
  };

  const confirm = () => {
    const picked = new Date(selYear, selMonth - 1, selDay);
    onChange(picked);
    setOpen(false);
  };

  const cancel = () => setOpen(false);

  return (
    <View style={{ width: "100%" }}>
      <TouchableOpacity
        onPress={openModal}
        activeOpacity={0.8}
        disabled={disabled}
        style={[
          styles.inputShell,
          { opacity: disabled ? 0.6 : 1 },
        ]}
      >
        <Text style={[styles.inputText, { color: value ? "#111" : "#999" }]}>
          {displayText}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={cancel}>
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { borderTopColor: themeColor }]}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={cancel} style={styles.headerBtn}>
                <Text style={styles.headerBtnText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: themeColor }]}>Select Date</Text>
              <TouchableOpacity onPress={confirm} style={styles.headerBtn}>
                <Text style={[styles.headerBtnText, { color: themeColor, fontWeight: "700" }]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.wheelsRow}>
              <View style={styles.wheelCol}>
                <Text style={styles.colLabel}>Day</Text>
                <Wheel data={days} initialIndex={initDayIdx} onSnap={(idx) => setSelDay(days[idx])} themeColor={themeColor} />
              </View>

              <View style={styles.wheelCol}>
                <Text style={styles.colLabel}>Month</Text>
                <Wheel data={months} initialIndex={initMonthIdx} onSnap={(idx) => setSelMonth(months[idx])} themeColor={themeColor} />
              </View>

              <View style={styles.wheelCol}>
                <Text style={styles.colLabel}>Year</Text>
                <Wheel data={years} initialIndex={initYearIdx} onSnap={(idx) => setSelYear(years[idx])} themeColor={themeColor} />
              </View>
            </View>

            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Selected:</Text>
              <Text style={[styles.previewValue, { color: themeColor }]}>
                {pad2(selDay)}/{pad2(selMonth)}/{selYear}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputShell: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular_400,
    color: '#000000',
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFB6C1',
    borderRadius: 12,
    shadowColor: "#FF7F7F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    paddingHorizontal: 14,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  inputText: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 16,
    borderTopWidth: 3,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 16, fontWeight: "600" },
  headerBtn: { paddingVertical: 8, paddingHorizontal: 10 },
  headerBtnText: { fontSize: 15, color: "#444" },
  wheelsRow: {
    flexDirection: "row",
    width: "100%",           
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 12,
  },
  wheelCol: {
    flex: 1,                
    alignItems: "center",
  },
  colLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: 6,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  wheelText: { fontSize: 18, color: "#666" },
  centerHighlight: {
    position: "absolute",
    top: (ITEM_HEIGHT * VISIBLE_ITEMS) / 2 - ITEM_HEIGHT / 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderRadius: 6,
  },
  previewRow: {
    marginTop: 8,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewLabel: { fontSize: 14, color: "#666" },
  previewValue: { fontSize: 16, fontWeight: "600" },
});
