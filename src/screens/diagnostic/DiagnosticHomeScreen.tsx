import React, { useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginResponse } from '../../services/authService';
import Colors from '../../theme/colors';

// ---- Tile data -----------------------------------------------------------
const TILES = [
  { title: 'Doctor Appointments', sub: 'Book your serial',          bg: '#EDF8F4', border: '#C3E6DC', chip: '#3FA592', icon: '⚕' },
  { title: 'Medical Test',        sub: 'Book a lab test',           bg: '#EEF6FD', border: '#B6D5EE', chip: '#4A8FC0', icon: '☑' },
  { title: 'List of Doctors',     sub: 'Find A Specialist',         bg: '#F0F2FC', border: '#CBD1F2', chip: '#5F6DC9', icon: '⊕' },
  { title: 'Tests & Price',       sub: 'Compare Test Rates',        bg: '#F4EFFD', border: '#CDBEEE', chip: '#9280CE', icon: '⚗' },
  { title: 'Messages',            sub: 'Chats & Updates',           bg: '#FCEFF7', border: '#EFC6E1', chip: '#B860A4', icon: '✉' },
  { title: 'Financial Information', sub: 'Earnings & payments',     bg: '#F5F9EE', border: '#CBDEA6', chip: '#829F4E', icon: '↑' },
  { title: 'Diagnostic Profile',  sub: 'Center Info & Services',    bg: '#EAF1F5', border: '#B9CCD8', chip: '#6C8DA1', icon: '⊞' },
  { title: 'Agent Referrals',     sub: 'Refer And Earn',            bg: '#FCEFF0', border: '#F0C2C7', chip: '#C05A6B', icon: '◈' },
  { title: 'Be A Protikar Agent', sub: 'Join As An Agent',          bg: '#F6F0F8', border: '#E2CEEA', chip: '#A67ABA', icon: '☎' },
  { title: 'Advertise',           sub: 'Promote Your Service',      bg: '#FBF5E3', border: '#E5D6A9', chip: '#B08F3C', icon: 'AD' },
];

// ---- Bottom nav ----------------------------------------------------------
const NAV_ITEMS = [
  { id: 'home',    label: 'Home',    icon: '⌂' },
  { id: 'inbox',   label: 'Inbox',   icon: '✉' },
  { id: 'agent',   label: 'Agent',   icon: '☎' },
  { id: 'profile', label: 'Profile', icon: '≡' },
];

interface Props {
  authData: LoginResponse;
  onLogout: () => void;
}

export default function DiagnosticHomeScreen({ authData, onLogout }: Props) {
  const [lang, setLang] = useState<'BN' | 'EN'>('BN');
  const [tab, setTab] = useState('home');
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1600);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── Teal header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Image
              source={require('../../../assets/images/protikar_logo.png')}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.headerTitle}>Protikar AI</Text>
        </View>

        <View style={styles.headerRight}>
          {/* Language toggle pill */}
          <TouchableOpacity
            style={styles.langToggle}
            onPress={() => setLang(l => (l === 'BN' ? 'EN' : 'BN'))}>
            {lang === 'EN' && <Text style={styles.langText}>EN</Text>}
            <View style={styles.langDot} />
            {lang === 'BN' && <Text style={styles.langText}>BN</Text>}
          </TouchableOpacity>

          {/* Bell */}
          <TouchableOpacity onPress={() => showToast('Notifications')}>
            <View style={styles.bellWrap}>
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.bellDot} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Feature grid ── */}
      <View style={styles.grid}>
        {Array.from({ length: 5 }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {TILES.slice(rowIndex * 2, rowIndex * 2 + 2).map(tile => (
              <TouchableOpacity
                key={tile.title}
                style={[styles.tile, { backgroundColor: tile.bg, borderColor: tile.border }]}
                onPress={() => showToast(tile.title)}
                activeOpacity={0.75}>
                <View style={[styles.chip, { backgroundColor: tile.chip }]}>
                  <Text style={styles.chipIcon}>{tile.icon}</Text>
                </View>
                <View>
                  <Text style={styles.tileTitle}>{tile.title}</Text>
                  <Text style={styles.tileSub}>{tile.sub}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* ── Bottom nav ── */}
      <SafeAreaView edges={['bottom']} style={styles.bottomNav}>
        {NAV_ITEMS.map(item => {
          const active = tab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => {
                setTab(item.id);
                if (item.id === 'profile') onLogout();
              }}>
              <Text style={[styles.navIcon, active && styles.navIconActive]}>
                {item.icon}
              </Text>
              <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </SafeAreaView>

      {/* ── Toast ── */}
      {toast ? (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  // Header
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 46,
    height: 46,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 34,
    height: 34,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#084B4C',
    borderRadius: 16,
    paddingHorizontal: 4,
    height: 28,
    width: 58,
    gap: 2,
  },
  langDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.white,
  },
  langText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  bellWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: 24,
  },
  bellDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#EF5D6E',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  // Grid
  grid: {
    flex: 1,
    padding: 16,
    gap: 12,
    backgroundColor: Colors.bg,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    gap: 10,
  },
  chip: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIcon: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.main,
    lineHeight: 20,
  },
  tileSub: {
    fontSize: 13,
    color: Colors.secondary,
    lineHeight: 18,
    marginTop: 2,
  },
  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  navItem: {
    alignItems: 'center',
    gap: 3,
    paddingBottom: 4,
  },
  navIcon: {
    fontSize: 26,
    color: Colors.disable,
  },
  navIconActive: {
    color: Colors.primary,
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.disable,
  },
  navLabelActive: {
    color: Colors.primary,
  },
  // Toast
  toast: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: Colors.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  toastText: {
    color: Colors.white,
    fontSize: 12,
  },
});
