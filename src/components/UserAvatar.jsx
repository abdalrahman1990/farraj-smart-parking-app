import React, { useState } from 'react';
import { Image, Platform, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import urls from '../apis/urls';

export const absolutizeAvatar = (u) => {
  if (!u) return '';
  const s = String(u).trim();
  if (!s) return '';
  if (/^https?:\/\//.test(s)) return s;
  const base = (urls.host || '').replace(/\/$/, '');
  return base ? base + (s.startsWith('/') ? s : '/' + s) : s;
};

const UserAvatar = ({
  uri,
  size = 52,
  borderColor = 'rgba(255,255,255,0.45)',
  borderWidth = 2.5,
  roundedSquare = false,
}) => {
  const [failed, setFailed] = useState(false);
  const finalUri = absolutizeAvatar(uri);
  const style = {
    width: size,
    height: size,
    borderRadius: roundedSquare ? Math.round(size * 0.28) : size / 2,
    borderWidth,
    borderColor,
    backgroundColor: '#F0F0F0',
  };
  if (!finalUri || failed) {
    return (
      <View style={[style, { alignItems: 'center', justifyContent: 'center' }]}>
        <Icon name="person" size={size * 0.45} color="#9CA3AF" />
      </View>
    );
  }
  return (
    <Image
      source={Platform.OS === 'android'
        ? { uri: finalUri, headers: { 'User-Agent': 'SmartParking/1.0 (Android)' } }
        : { uri: finalUri, headers: { 'User-Agent': 'SmartParking/1.0 (iOS)' } }}
      onError={() => setFailed(true)}
      style={style}
      resizeMode="cover"
    />
  );
};

export default UserAvatar;
