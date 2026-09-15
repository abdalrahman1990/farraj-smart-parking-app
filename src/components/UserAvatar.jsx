import React, { useState } from 'react';
import { Image, Platform, View } from 'react-native';
import urls from '../apis/urls';

export const absolutizeAvatar = (u) => {
  if (!u) return '';
  const s = String(u).trim();
  if (!s) return '';
  if (/^https?:\/\//.test(s)) return s;
  const base = (urls.host || '').replace(/\/$/, '');
  return base ? base + (s.startsWith('/') ? s : '/' + s) : s;
};

const FALLBACK = require('../assets/images/farraj-logo.png');

const UserAvatar = ({ uri, size = 52, borderColor = 'rgba(255,255,255,0.45)', borderWidth = 2.5 }) => {
  const [failed, setFailed] = useState(false);
  const finalUri = absolutizeAvatar(uri);
  const style = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth,
    borderColor,
    backgroundColor: '#FFFFFF',
  };
  if (!finalUri || failed) {
    return (
      <View style={[style, { alignItems: 'center', justifyContent: 'center', padding: size * 0.14, overflow: 'hidden' }]}>
        <Image source={FALLBACK} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
      </View>
    );
  }
  return (
    <Image
      source={Platform.OS === 'android'
        ? { uri: finalUri, headers: { 'User-Agent': 'FarrajSmartParking/1.0 (Android)' } }
        : { uri: finalUri }}
      defaultSource={Platform.OS === 'android' ? FALLBACK : undefined}
      onError={() => setFailed(true)}
      style={style}
      resizeMode="cover"
    />
  );
};

export default UserAvatar;
