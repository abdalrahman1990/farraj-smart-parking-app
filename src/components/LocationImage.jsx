import React, { useState } from 'react';
import { Image } from 'react-native';
import urls from '../apis/urls';

const ASSET_HOST = (urls.host || '').replace(/\/$/, '');

export const absolutizeUrl = (u) => {
  if (!u || /^https?:\/\//.test(u)) return u;
  if (!ASSET_HOST) return u;
  return ASSET_HOST + (u.startsWith('/') ? u : '/' + u);
};

const LocationImage = ({ uri, name, style }) => {
  const [broken, setBroken] = useState(false);
  const cleanUri = uri ? String(uri).trim() : '';
  const finalUri = cleanUri ? absolutizeUrl(cleanUri) : '';

  if (broken || !finalUri) {
    return (
      <Image
        source={require('../assets/images/default-location.jpg')}
        style={style}
        resizeMode="cover"
      />
    );
  }

  return (
    <Image
      source={{ uri: finalUri }}
      onError={() => setBroken(true)}
      style={style}
      resizeMode="cover"
    />
  );
};

export default LocationImage;
