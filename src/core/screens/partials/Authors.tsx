import { StyleSheet, Users, Constants, Profiles, AsyncUsers, React } from '@metro/common';
import { Text, TouchableOpacity, View } from '@components';

const { Fonts, ThemeColorMap } = Constants;

const useStyles = StyleSheet.createStyles({
    linkless: {
      color: ThemeColorMap.HEADER_SECONDARY,
      fontFamily: Fonts.PRIMARY_SEMIBOLD,
      display: 'flex',
      fontSize: 16,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center'
    },

    link: {
      color: ThemeColorMap.HEADER_PRIMARY,
      fontFamily: Fonts.PRIMARY_SEMIBOLD,
      display: 'flex',
      alignItems: 'center',
      fontSize: 16,
      alignSelf: 'center',
      justifyContent: 'center'
    }
});

export default function ({ authors }) {
  const styles = useStyles();

  if (!authors || !Array.isArray(authors) || !authors.length) {
    return null;
  }

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