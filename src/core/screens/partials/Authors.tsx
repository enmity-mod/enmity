import { StyleSheet, Users, ColorMap, Constants, Profiles, AsyncUsers } from '@metro/common';
import { Text, TouchableOpacity, View } from '@components';
import React from 'react';

const { colors } = ColorMap;

export default function ({ authors }) {
  if (!authors || !Array.isArray(authors) || !authors.length) {
    return null;
  }

  const styles = StyleSheet.createThemedStyleSheet({
    linkless: {
      color: colors.HEADER_SECONDARY,
      fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
      display: 'flex',
      fontSize: 16,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center'
    },

    link: {
      color: colors.HEADER_PRIMARY,
      fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
      display: 'flex',
      alignItems: 'center',
      fontSize: 16,
      alignSelf: 'center',
      justifyContent: 'center'
    }
  });

  return <View style={styles.container}>
    {authors.map((author, index) => {
      const isFirst = index !== authors.length - 1;

      if (typeof author === 'string') {
        return (
          <Text style={styles.linkless}>
            {author}{isFirst && ','}
          </Text>
        );
      } else if (typeof author === 'object' && author.name && !author.id) {
        return (
          <Text style={styles.linkless}>
            {author.name}{isFirst && ','}
          </Text>
        );
      } else if (typeof author === 'object' && author.name && author.id) {
        return (
          <TouchableOpacity
            key={author.id}
            onPress={() => {
              if (!Users.getUser(author.id)) {
                AsyncUsers.fetchProfile(author.id).then(() => {
                  Profiles.showUserProfile({ userId: author.id });
                });
              } else {
                Profiles.showUserProfile({ userId: author.id });
              }
            }}
          >
            <Text style={styles.link}>
              {author.name}{isFirst && ','}
            </Text>
          </TouchableOpacity>
        );
      }

      return null;
    }).filter(Boolean)}
  </View>;
}