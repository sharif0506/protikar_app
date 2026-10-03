import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FormField from '../../../components/common/FormField';
import Colors from '../../../theme/colors';
import { RegisterFormData } from '../../../types/auth';

interface Props {
  form: RegisterFormData;
  setField: (key: keyof RegisterFormData, value: string) => void;
}

export default function UserForm({ form, setField }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <View style={styles.fields}>
      <FormField icon={<Text style={styles.icon}>◉</Text>}>
        <TextInput
          style={styles.input}
          value={form.fullName}
          onChangeText={v => setField('fullName', v)}
          placeholder="Full Name"
          placeholderTextColor={Colors.disable}
        />
      </FormField>

      <FormField icon={<Text style={styles.icon}>✆</Text>}>
        <Text style={styles.prefix}>+880</Text>
        <Text style={styles.sep}>|</Text>
        <TextInput
          style={styles.input}
          value={form.mobile}
          onChangeText={v => setField('mobile', v)}
          placeholder="Mobile number"
          placeholderTextColor={Colors.disable}
          keyboardType="phone-pad"
        />
      </FormField>

      <FormField icon={<Text style={styles.icon}>✉</Text>}>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={v => setField('email', v)}
          placeholder="Email address"
          placeholderTextColor={Colors.disable}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </FormField>

      <FormField
        icon={<Text style={styles.icon}>⚿</Text>}
        trailing={
          <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
            <Text style={styles.eye}>{showPassword ? '◎' : '⊙'}</Text>
          </TouchableOpacity>
        }>
        <TextInput
          style={styles.input}
          value={form.password}
          onChangeText={v => setField('password', v)}
          placeholder="Password"
          placeholderTextColor={Colors.disable}
          secureTextEntry={!showPassword}
        />
      </FormField>

      <FormField
        icon={<Text style={styles.icon}>⚿</Text>}
        trailing={
          <TouchableOpacity onPress={() => setShowConfirm(v => !v)}>
            <Text style={styles.eye}>{showConfirm ? '◎' : '⊙'}</Text>
          </TouchableOpacity>
        }>
        <TextInput
          style={styles.input}
          value={form.confirm}
          onChangeText={v => setField('confirm', v)}
          placeholder="Confirm Password"
          placeholderTextColor={Colors.disable}
          secureTextEntry={!showConfirm}
        />
      </FormField>
    </View>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 8,
  },
  icon: {
    fontSize: 20,
    color: Colors.secondary,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.main,
    padding: 0,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  sep: {
    fontSize: 16,
    color: Colors.secondary,
    opacity: 0.5,
  },
  eye: {
    fontSize: 20,
    color: Colors.secondary,
  },
});