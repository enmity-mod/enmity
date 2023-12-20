import { StyleSheet, Users, Constants, Profiles, AsyncUsers, React } from '@metro/common';
import { Text, TouchableOpacity, View } from '@components';

const { Fonts, ThemeColorMap } = Constants;

const commonAuthorStyle = {
  fontFamily: Fonts.PRIMARY_SEMIBOLD,
  display: 'flex',
  fontSize: 16,
  alignItems: 'center',
  alignSelf: 'center',
  justifyContent: 'center'
};

const styles = StyleSheet.createThemedStyleSheet({
    linkless: {
      ...commonAuthorStyle,
      color: ThemeColorMap.HEADER_SECONDARY
    },

    link: {
      ...commonAuthorStyle,
      color: ThemeColorMap.HEADER_PRIMARY
    }
});

export default function ({ authors }) {
  if (!authors || !Array.isArray(authors) || !authors.length) {
    return null;
  }

  return <View>
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