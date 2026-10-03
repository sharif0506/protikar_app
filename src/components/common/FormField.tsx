import React from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../theme/colors';

interface Props {
  icon: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}

export default function FormField({ icon, trailing, children }: Props) {
  return (
    <View style={styles.field}>
      <View style={styles.row}>
        {icon}
        {children}
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.field,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    height: 60,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
});