import React, { useCallback, useState } from 'react';
import { NativeSyntheticEvent, Text, TextLayoutEventData } from 'react-native';
import styled from 'styled-components/native';
import { GalleryGrid } from '../components/gallery-grid';
import { ProfileHeader } from '../components/profile-header/ProfileHeader';
import { generateMockPost, generateMockProfile } from '../data';

const posts = [...Array(40)].map((_, i) =>
  generateMockPost({ mediasQty: i % 2 === 0 ? 1 : 2 }),
);

const profile = generateMockProfile();

export function ProfileScreen(): JSX.Element {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [bioLines, setBioLines] = useState(0);

  const handleBioLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      setBioLines(e.nativeEvent.lines.length);
    },
    [],
  );

  const handleBioExpand = useCallback(() => {
    setBioExpanded(true);
  }, []);

  return (
    <Container
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={() => (
        <>
          <TopContainer>
            <StyledHeader {...profile} />
            <BoldText>{profile.fullName}</BoldText>
            {profile.bio ? (
              <>
                <Text
                  onTextLayout={handleBioLayout}
                  {...(!bioExpanded && { numberOfLines: 2 })}
                  testID="profile-bio"
                >
                  {profile.bio}
                </Text>
                {bioLines > 2 && !bioExpanded ? (
                  <WeakText onPress={handleBioExpand}>more</WeakText>
                ) : null}
              </>
            ) : null}
          </TopContainer>
          <GalleryGrid posts={posts} />
        </>
      )}
    />
  );
}

const Container = styled.FlatList`
  flex: 1;
`;

const TopContainer = styled.View`
  padding: 0 ${({ theme }) => theme.spacing.l};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const BoldText = styled(Text)`
  font-weight: bold;
`;

const WeakText = styled(Text)`
  color: ${({ theme }) => theme.color.gray};
`;

const StyledHeader = styled(ProfileHeader)`
  padding: ${({ theme }) => theme.spacing.s} 0;
`;
