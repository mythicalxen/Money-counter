// App.js — Expo React Native Money Counter for Samsung // Features: // - IQD & USD denominations with +/- buttons // - Long-press to add/subtract 5 at a time // - Subtotals per currency and grand totals with optional exchange rate (IQD per 1 USD) // - Big buttons/text for cashier use, haptic-like feedback via subtle animations only (no extra libs) // - Works in Expo Go (no build needed). No extra packages required.

import React, { useMemo, useState } from 'react'; import { SafeAreaView, View, Text, Pressable, TextInput, ScrollView } from 'react-native';

const IQD_DENOMS = [50000, 25000, 10000, 5000, 1000, 500, 250]; const USD_DENOMS = [100, 50, 20, 10, 5, 1];

const CurrencyTabs = ({ currency, setCurrency }) => ( <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}> {['IQD', 'USD'].map((c) => ( <Pressable key={c} onPress={() => setCurrency(c)} style={({ pressed }) => ({ flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center', backgroundColor: currency === c ? '#111827' : '#e5e7eb', opacity: pressed ? 0.8 : 1, })} > <Text style={{ color: currency === c ? 'white' : '#111827', fontSize: 18, fontWeight: '700' }}>{c}</Text> </Pressable> ))} </View> );

const Row = ({ denom, count, onInc, onDec }) => ( <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#e5e7eb' }}> <View style={{ width: 90 }}> <Text style={{ fontSize: 18, fontWeight: '700' }}>{denom.toLocaleString()}</Text> </View>

<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
  <Pressable
    onPress={onDec}
    onLongPress={() => onDec(5)}
    style={({ pressed }) => ({
      backgroundColor: '#f3f4f6', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12,
      borderWidth: 1, borderColor: '#d1d5db', opacity: pressed ? 0.8 : 1,
    })}
  >
    <Text style={{ fontSize: 24, fontWeight: '800' }}>−</Text>
  </Pressable>

  <View style={{ minWidth: 70, alignItems: 'center' }}>
    <Text style={{ fontSize: 22, fontWeight: '800' }}>{count}</Text>
  </View>

  <Pressable
    onPress={onInc}
    onLongPress={() => onInc(5)}
    style={({ pressed }) => ({
      backgroundColor: '#111827', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12,
      opacity: pressed ? 0.8 : 1,
    })}
  >
    <Text style={{ fontSize: 24, fontWeight: '800', color: 'white' }}>+</Text>
  </Pressable>

  <View style={{ width: 110, alignItems: 'flex-end' }}>
    <Text style={{ fontSize: 18, fontWeight: '700' }}>
      {(denom * count).toLocaleString()
      }
    </Text>
  </View>
</View>

  </View>
);export default function App() { const [currency, setCurrency] = useState('IQD'); const [countsIQD, setCountsIQD] = useState(Object.fromEntries(IQD_DENOMS.map(d => [d, 0]))); const [countsUSD, setCountsUSD] = useState(Object.fromEntries(USD_DENOMS.map(d => [d, 0]))); const [rate, setRate] = useState('1300'); // IQD per 1 USD (editable)

const denoms = currency === 'IQD' ? IQD_DENOMS : USD_DENOMS; const counts = currency === 'IQD' ? countsIQD : countsUSD; const setCounts = currency === 'IQD' ? setCountsIQD : setCountsUSD;

const totalIQD = useMemo(() => IQD_DENOMS.reduce((s, d) => s + d * (countsIQD[d] || 0), 0), [countsIQD]); const totalUSD = useMemo(() => USD_DENOMS.reduce((s, d) => s + d * (countsUSD[d] || 0), 0), [countsUSD]);

const numericRate = Number(rate.replace(/[^0-9.]/g, '')) || 0; const grandInIQD = totalIQD + totalUSD * numericRate; const grandInUSD = numericRate > 0 ? (totalUSD + totalIQD / numericRate) : 0;

const changeCount = (d, delta = 1) => { setCounts(prev => ({ ...prev, [d]: Math.max(0, (prev[d] || 0) + delta) })); };

const resetAll = () => { setCountsIQD(Object.fromEntries(IQD_DENOMS.map(d => [d, 0]))); setCountsUSD(Object.fromEntries(USD_DENOMS.map(d => [d, 0]))); };

return ( <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}> <View style={{ padding: 16, gap: 12, flex: 1 }}> <Text style={{ fontSize: 26, fontWeight: '800' }}>Money Counter</Text> <CurrencyTabs currency={currency} setCurrency={setCurrency} />

<View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: '700' }}>Rate (IQD per $1):</Text>
      <TextInput
        value={rate}
        onChangeText={setRate}
        keyboardType="numeric"
        placeholder="e.g. 1300"
        style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, minWidth: 110, fontSize: 16 }}
      />
      <Pressable onPress={() => setRate('')} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' }}>
        <Text style={{ fontSize: 14, fontWeight: '700' }}>Clear</Text>
      </Pressable>
    </View>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
      <View>
        <Text style={{ fontSize: 14, color: '#6b7280' }}>Subtotal IQD</Text>
        <Text style={{ fontSize: 22, fontWeight: '800' }}>{totalIQD.toLocaleString()} IQD</Text>
      </View>
      <View>
        <Text style={{ fontSize: 14, color: '#6b7280' }}>Subtotal USD</Text>
        <Text style={{ fontSize: 22, fontWeight: '800' }}>${totalUSD.toLocaleString()}</Text>
      </View>
    </View>

    <ScrollView style={{ flex: 1, marginTop: 8 }} contentContainerStyle={{ paddingBottom: 120 }}>
      {denoms.map((d) => (
        <Row
          key={d}
          denom={d}
          count={counts[d] || 0}
          onInc={(n = 1) => changeCount(d, n)}
          onDec={(n = 1) => changeCount(d, -n)}
        />
      ))}
    </ScrollView>

    <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16, gap: 10 }}>
      <View style={{ backgroundColor: '#111827', borderRadius: 16, padding: 16 }}>
        <Text style={{ color: 'white', fontSize: 14 }}>Grand Total (IQD)</Text>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: '900' }}>{grandInIQD.toLocaleString()} IQD</Text>
        <Text style={{ color: 'white', fontSize: 14, marginTop: 6 }}>Grand Total (USD)</Text>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '900' }}>${grandInUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          onPress={resetAll}
          style={({ pressed }) => ({ flex: 1, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 14, borderRadius: 14, alignItems: 'center', opacity: pressed ? 0.8 : 1 })}
        >
          <Text style={{ fontSize: 16, fontWeight: '800' }}>Reset</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            // Simple zero-all for current currency
            const zero = Object.fromEntries(denoms.map(d => [d, 0]));
            setCounts(prev => ({ ...prev, ...zero }));
          }}
          style={({ pressed }) => ({ flex: 1, backgroundColor: '#111827', paddingVertical: 14, borderRadius: 14, alignItems: 'center', opacity: pressed ? 0.8 : 1 })}
        >
          <Text style={{ fontSize: 16, fontWeight: '800', color: 'white' }}>Clear {currency}</Text>
        </Pressable>
      </View>
    </View>
  </View>
</SafeAreaView>

); }

