import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TextComponent from '@components/global/TextComponent';
import { ENV, Fonts } from '@utils/Constants';
import { navigate } from '@utils/NavigationUtils';
import { goBack, resetAndNavigate } from '@utils/NavigationUtils';
import InputField from '@components/global/InputField';
import DropdownField from '@components/global/DropdownField';
import PinkButton from '@components/global/PinkButton';
import auth from '@react-native-firebase/auth';

type PersonalData = {
  feet: string | null;
  inch: string | null;
  looking: string | null;
  smoking: string | null;
  drinking: string | null;
  workout: string | null;
  religion: string;
  sign: string | null;
  status: string | null;
  kids: string | null;
  genderPreference: string;
  workingAt: string | null;
  profession: string | null;
  education: string | null;
};

type UserData = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string | null;
  photoURL: string | null;
  birthdate: string;
  gender: string;
  city: string;
  pincode: string | null;
  interests: string[];
  pictures: string[];
  personalData: PersonalData;
  provider: string;
};

const EditProfile = () => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>();

  const [userData, setUserData] = useState<UserData>();
  const [userEditData, setUserEditData] = useState<UserData | null>(null);

  const updatePersonalData = (field: string, value: string) => {
    setUserEditData(prev =>
      prev
        ? {
            ...prev,
            personalData: {
              ...prev.personalData,
              [field]: value,
            },
          }
        : null,
    );
  };

  const updateSubmit = async () => {
    try {
    //   const api = `${ENV.API_IP}:3000/api/userDetails/updateProfile`;

    //   const res = await fetch(api, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(userEditData),
    //   });

    //   const data = await res.json();

    //   if (data.success) {
    //     Alert.alert('Success', 'Profile updated successfully');
    //     goBack();
    //   } else {
    //     Alert.alert('Error', 'Update failed');
    //   }

    console.log(userEditData);
    

    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const getUserDetails = async () => {
    const userDetails = auth().currentUser;
    if (!userDetails) {
      Alert.alert('User Not found', 'Error getting user');
    }
    const userId = userDetails?.uid;
    console.log(userId);

    // const api = 'http://10.0.2.2:3000/api/userDetails/profile';
    console.log(ENV.API_IP);

    const api = `${ENV.API_IP}:3000/api/userDetails/profile`;

    const res = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const userInfo = await res.json();

    if (userInfo.foundData) {
      const user = userInfo.response.user;
      setUserData(user);
      setUserEditData(user);
    } else {
      Alert.alert('User Not Found', '', [
        { text: 'OK', onPress: () => resetAndNavigate('HomeScreen') },
      ]);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <CustomSafeAreaView style={{}}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.topmessagebar}>
          <View style={styles.backcon}>
            <TouchableOpacity onPress={goBack}>
              <Image
                source={require('@assets/icons/back.png')}
                style={styles.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextComponent style={styles.title1}>Edit Profile</TextComponent>
          </View>
        </View>

        <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextComponent style={styles.inputtitle}>First Name</TextComponent>
            <InputField
              placeholder="Enter your first name"
              value={userEditData?.firstName}
              onChangeText={text =>
                setUserEditData(prev => prev && { ...prev, firstName: text })
              }
            />
            <View style={{ height: 20 }}></View>
            <TextComponent style={styles.inputtitle}>Last Name</TextComponent>
            <InputField
              placeholder="Enter your Last name"
              value={userEditData?.lastName ?? ''}
              onChangeText={text =>
                setUserEditData(prev => prev && { ...prev, lastName: text })
              }
            />
            <View style={{ height: 20 }}></View>

            <TextComponent style={styles.inputtitle}>Height</TextComponent>
            <View style={styles.rowcon}>
              <View style={{ width: '48%' }}>
                <DropdownField
                  options={['4 Feet', '5 Feet', '6 Feet', '7 Feet']}
                  placeholder="Feet"
                  value={userEditData?.personalData?.feet ?? ''}
                  onSelect={val => updatePersonalData('feet', val)}
                />
              </View>
              <View style={{ width: '48%' }}>
                <DropdownField
                  options={[
                    '0 Inch',
                    '1 Inch',
                    '2 Inch',
                    '3 Inch',
                    '4 Inch',
                    '5 Inch',
                    '6 Inch',
                    '7 Inch',
                    '8 Inch',
                    '9 Inch',
                    '10 Inch',
                    '11 Inch',
                  ]}
                  placeholder="Inch"
                  value={userEditData?.personalData?.inch ?? ''}
                  onSelect={val => updatePersonalData('inch', val)}
                />
              </View>
            </View>

            <View style={{ height: 20 }} />
            <TextComponent style={styles.inputtitle}>Looking For</TextComponent>
            <DropdownField
              options={[
                'Serious relationship',
                'Casual relationship',
                'Figuring out',
                'Dont want to say',
              ]}
              placeholder="Looking for"
              value={userEditData?.personalData?.looking ?? ''}
              onSelect={val => updatePersonalData('looking', val)}
            />

            <View style={{ height: 20 }} />
            <View style={styles.rowcon}>
              <View style={{ width: '48%' }}>
                <TextComponent style={styles.inputtitle}>Smoking</TextComponent>
                <DropdownField
                  options={['Yes', 'No', 'Sometimes', 'Dont want to say']}
                  placeholder="Smoking"
                  value={userEditData?.personalData?.smoking ?? ''}
                  onSelect={val => updatePersonalData('smoking', val)}
                />
              </View>
              <View style={{ width: '48%' }}>
                <TextComponent style={styles.inputtitle}>
                  Drinking
                </TextComponent>
                <DropdownField
                  options={['Yes', 'No', 'Sometimes', 'Dont want to say']}
                  placeholder="Drinking"
                  value={userEditData?.personalData?.drinking ?? ''}
                  onSelect={val => updatePersonalData('drinking', val)}
                />
              </View>
            </View>

            <View style={{ height: 20 }} />
            <TextComponent style={styles.inputtitle}>Workout</TextComponent>
            <DropdownField
              options={['Active', 'Inactive', 'Sometimes']}
              placeholder="Workout"
              value={userEditData?.personalData?.workout ?? ''}
              onSelect={val => updatePersonalData('workout', val)}
            />

            <View style={{ height: 20 }} />
            <TextComponent style={styles.inputtitle}>
              Religion
              <TextComponent style={{ color: 'red' }}> *</TextComponent>
            </TextComponent>
            <DropdownField
              options={[
                'Christianity',
                'Islam',
                'Hinduism',
                'Buddhism',
                'Sikhism',
                'Judaism',
                'Jainism',
                "Baha'i Faith",
                'Confucianism',
                'Taoism',
                'Shinto',
                'Chinese Folk Religion',
                'Animism/Adivasi',
                'No Religion',
              ]}
              placeholder="Religion"
              value={userEditData?.personalData?.religion ?? ''}
              onSelect={val => updatePersonalData('religion', val)}
            />

            <View style={{ height: 20 }} />
            <TextComponent style={styles.inputtitle}>Sun sign</TextComponent>
            <DropdownField
              options={[
                'Aries',
                'Taurus',
                'Gemini',
                'Cancer',
                'Leo',
                'Virgo',
                'Libra',
                'Scorpio',
                'Sagittarius',
                'Capricorn',
                'Aquarius',
                'Pisces',
              ]}
              placeholder="Sun sign"
              value={userEditData?.personalData?.sign ?? ''}
              onSelect={val => updatePersonalData('sign', val)}
            />

            <View style={{ height: 20 }} />
            <View style={styles.rowcon}>
              <View style={{ width: '48%' }}>
                <TextComponent style={styles.inputtitle}>
                  Marital Status
                </TextComponent>
                <DropdownField
                  options={['Married', 'Unmarried', 'Dont want to say']}
                  placeholder="Marital Status"
                  value={userEditData?.personalData?.status ?? ''}
                  onSelect={val => updatePersonalData('status', val)}
                />
              </View>
              <View style={{ width: '48%' }}>
                <TextComponent style={styles.inputtitle}>Kids</TextComponent>
                <DropdownField
                  options={[
                    'Yes',
                    'No',
                    'Want',
                    "Don't want",
                    'Dont want to say',
                  ]}
                  placeholder="Kids"
                  value={userEditData?.personalData?.kids ?? ''}
                  onSelect={val => updatePersonalData('kids', val)}
                />
              </View>
            </View>

            <View style={{ height: 20 }} />
            <TextComponent style={styles.inputtitle}>
              Gender Preference
              <TextComponent style={{ color: 'red' }}> *</TextComponent>
            </TextComponent>
            <DropdownField
              options={['male', 'female', 'both']}
              placeholder="Gender preference"
              value={userEditData?.personalData?.genderPreference ?? ''}
              onSelect={val => updatePersonalData('genderPreference', val)}
            />

            <View style={{ height: 16 }}></View>
            <TextComponent style={styles.inputtitle}>Working</TextComponent>
            <InputField
              placeholder="TCS / Wipro"
              value={userEditData?.personalData?.workingAt ?? ''}
              onChangeText={text =>
                setUserEditData(prev =>
                  prev
                    ? {
                        ...prev,
                        personalData: {
                          ...prev.personalData,
                          workingAt: text,
                        },
                      }
                    : null,
                )
              }
            />
            <View style={{ height: 20 }}></View>
            <TextComponent style={styles.inputtitle}>Profession</TextComponent>
            <InputField
              placeholder="Profession"
              value={userEditData?.personalData?.profession ?? ''}
              onChangeText={text =>
                setUserEditData(prev =>
                  prev
                    ? {
                        ...prev,
                        personalData: {
                          ...prev.personalData,
                          profession: text,
                        },
                      }
                    : null,
                )
              }
            />
            <View style={{ height: 20 }}></View>
            <TextComponent style={styles.inputtitle}>Education</TextComponent>
            <DropdownField
              options={[
                'No formal education',
                'Primary School',
                'Middle School',
                'High School / Secondary',
                'Higher Secondary (HSC)',
                'Diploma / Polytechnic',
                "Undergraduate (Bachelor's Degree)",
                "Graduate (Post Graduation / Master's Degree)",
                'Doctorate (PhD)',
                'Post Doctorate',
                'Professional Certification (CA, CS, CFA, etc.)',
                'Vocational Training',
                'Other',
              ]}
              placeholder="Select your education"
              value={userEditData?.personalData?.education ?? ''}
              onSelect={val => updatePersonalData('education', val)}
            />

            <PinkButton text={'Submit'} onPress={updateSubmit} />
          </ScrollView>
        </View>
      </View>
    </CustomSafeAreaView>
  );
};
const styles = StyleSheet.create({
  topmessagebar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#666666',
  },
  title1: {
    fontFamily: Fonts.Poppins_SemiBold_600,
    fontSize: 24,
    color: '#000000',
    textAlign: 'left',
  },
  backcon: {
    // paddingVertical: 8,
    flexDirection: 'row',
    gap: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  image: {
    width: 24,
    height: 24,
  },
  inputtitle: {
    fontFamily: Fonts.Poppins_Medium_500,
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },

  rowcon: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
export default EditProfile;
