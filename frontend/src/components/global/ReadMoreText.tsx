
import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

interface Props {
  text: string;
  numberOfChars?: number;
  textStyle?: any;
  readMoreTextStyle?: any;
}

const ReadMoreText: React.FC<Props> = ({
  text,
  numberOfChars = 150,
  textStyle,
  readMoreTextStyle,
}) => {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = text.length > numberOfChars;

  let displayText = '';
  if (!expanded && shouldTruncate) {
    displayText = text.slice(0, numberOfChars).trim() + ' ';
  } else {
    displayText = text;
  }

  return (
    <View>
      <Text style={textStyle}>
        {displayText}
        {shouldTruncate && (
          <Text
            onPress={() => setExpanded(!expanded)}
            style={[styles.readMore, readMoreTextStyle]}
          >
            {expanded ? 'Read less' : '....Read more'}
          </Text>
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  readMore: {
    color: '#FF7F7F',
    fontWeight: 'bold',
  },
});

export default ReadMoreText;
