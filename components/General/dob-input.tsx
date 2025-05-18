// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, TextInput, StyleSheet } from 'react-native';
// import { theme } from "@/infrastructure/themes";
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// interface SimpleDatePickerProps {
//   onDateChange: (date: string) => void;
//   placeholder?: string;
//   value?: string; // Add value prop to receive initial date
// }

// const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({ onDateChange, placeholder, value }) => {
//   const [day, setDay] = useState<string>('');
//   const [month, setMonth] = useState<string>('');
//   const [year, setYear] = useState<string>('');
  
//   const monthInput = useRef<TextInput>(null);
//   const yearInput = useRef<TextInput>(null);

//   // Parse and set initial value when provided
//   useEffect(() => {
//     if (value) {
//       // Parse the date string (expected format: YYYY-MM-DD)
//       const [yearVal, monthVal, dayVal] = value.split('-');
      
//       // Only set values if we got valid parts
//       if (yearVal && monthVal && dayVal) {
//         // Remove leading zeros
//         setDay(dayVal.replace(/^0+/, ''));
//         setMonth(monthVal.replace(/^0+/, ''));
//         setYear(yearVal);
//       }
//     }
//   }, [value]);

//   const handleDayChange = (text: string) => {
//     // Only allow numbers
//     const numericValue = text.replace(/[^0-9]/g, '');
    
//     // Limit to 2 digits and range 1-31
//     if (numericValue.length <= 2) {
//       const dayValue = numericValue === '' ? 0 : parseInt(numericValue, 10);
//       if (numericValue === '' || (dayValue >= 1 && dayValue <= 31)) {
//         setDay(numericValue);
        
//         // Auto-focus to month input if day is complete
//         if (numericValue.length === 2) {
//           monthInput.current?.focus();
//         }
//       }
//     }
    
//     updateParentDate(numericValue, month, year);
//   };

//   const handleMonthChange = (text: string) => {
//     // Only allow numbers
//     const numericValue = text.replace(/[^0-9]/g, '');
    
//     // Limit to 2 digits and range 1-12
//     if (numericValue.length <= 2) {
//       const monthValue = numericValue === '' ? 0 : parseInt(numericValue, 10);
//       if (numericValue === '' || (monthValue >= 1 && monthValue <= 12)) {
//         setMonth(numericValue);
        
//         // Auto-focus to year input if month is complete
//         if (numericValue.length === 2) {
//           yearInput.current?.focus();
//         }
//       }
//     }
    
//     updateParentDate(day, numericValue, year);
//   };

//   const handleYearChange = (text: string) => {
//     // Only allow numbers
//     const numericValue = text.replace(/[^0-9]/g, '');
    
//     // Limit to 4 digits and reasonable range
//     if (numericValue.length <= 4) {
//       // Don't validate incomplete years to allow typing
//       if (numericValue.length < 4) {
//         setYear(numericValue);
//       } else {
//         // Only validate complete years
//         const yearValue = parseInt(numericValue, 10);
//         const currentYear = new Date().getFullYear();
      
//         if (yearValue >= 1900 && yearValue <= currentYear) {
//           setYear(numericValue);
//         }
//       }
//     }
    
//     updateParentDate(day, month, numericValue);
//   };

//   const updateParentDate = (d: string, m: string, y: string) => {
//     // Only update parent if we have valid values for all three fields
//     if (d && m && y && y.length === 4) {
//       const dateString = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
//       onDateChange(dateString);
//     } else {
//       onDateChange('');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.dateInputContainer}>
//         <TextInput
//           style={styles.dateInput}
//           placeholder="DD"
//           keyboardType="number-pad"
//           maxLength={2}
//           value={day}
//           onChangeText={handleDayChange}
//           placeholderTextColor={theme.colors.ui.black + '70'}
//         />
//         <Text style={styles.separator}>/</Text>
//         <TextInput
//           ref={monthInput}
//           style={styles.dateInput}
//           placeholder="MM"
//           keyboardType="number-pad"
//           maxLength={2}
//           value={month}
//           onChangeText={handleMonthChange}
//           placeholderTextColor={theme.colors.ui.black + '70'}
//         />
//         <Text style={styles.separator}>/</Text>
//         <TextInput
//           ref={yearInput}
//           style={styles.yearInput}
//           placeholder="YYYY"
//           keyboardType="number-pad"
//           maxLength={4}
//           value={year}
//           onChangeText={handleYearChange}
//           placeholderTextColor={theme.colors.ui.black + '70'}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: wp("90%"),
//   },
//   label: {
//     fontFamily: theme.fontFamily.regular,
//     color: theme.colors.ui.black + '70',
//     marginBottom: 5,
//     marginLeft: 5,
//   },
//   dateInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: hp("7%"),
//     width: wp("90%"),
//     borderWidth: 0.2,
//     borderColor: theme.colors.brand.blue,
//     borderRadius: 5,
//     paddingHorizontal: hp("2.3%"),
//   },
//   dateInput: {
//     width: 30,
//     height: '100%',
//     color: theme.colors.ui.black,
//     fontFamily: theme.fontFamily.semiBold,
//     textAlign: 'center',
//   },
//   yearInput: {
//     width: 60,
//     height: '100%',
//     color: theme.colors.ui.black,
//     fontFamily: theme.fontFamily.semiBold,
//     textAlign: 'center',
//   },
//   separator: {
//     color: theme.colors.ui.black,
//     fontFamily: theme.fontFamily.semiBold,
//     fontSize: 18,
//     marginHorizontal: 5,
//   }
// });

// export default SimpleDatePicker;


import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { theme } from "@/infrastructure/themes";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface SimpleDatePickerProps {
  onDateChange: (date: string) => void;
  placeholder?: string;
  value?: string; // Add value prop to receive initial date
}

const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({ onDateChange, placeholder, value }) => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  
  const monthInput = useRef<TextInput>(null);
  const yearInput = useRef<TextInput>(null);

  // Parse and set initial value when provided
  useEffect(() => {
    if (value && value.trim()) {
      try {
        // Parse the date string (expected format: YYYY-MM-DD)
        const [yearVal, monthVal, dayVal] = value.split('-');
        
        // Only set values if we got valid parts
        if (yearVal && monthVal && dayVal) {
          // Remove leading zeros
          setDay(String(parseInt(dayVal, 10)));
          setMonth(String(parseInt(monthVal, 10)));
          setYear(yearVal);
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
  }, [value]);

  const handleDayChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Limit to 2 digits and range 1-31
    if (numericValue.length <= 2) {
      const dayValue = numericValue === '' ? 0 : parseInt(numericValue, 10);
      if (numericValue === '' || (dayValue >= 1 && dayValue <= 31)) {
        setDay(numericValue);
        
        // Auto-focus to month input if day is complete
        if (numericValue.length === 2) {
          monthInput.current?.focus();
        }
      }
    }
    
    updateParentDate(numericValue, month, year);
  };

  const handleMonthChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Limit to 2 digits and range 1-12
    if (numericValue.length <= 2) {
      const monthValue = numericValue === '' ? 0 : parseInt(numericValue, 10);
      if (numericValue === '' || (monthValue >= 1 && monthValue <= 12)) {
        setMonth(numericValue);
        
        // Auto-focus to year input if month is complete
        if (numericValue.length === 2) {
          yearInput.current?.focus();
        }
      }
    }
    
    updateParentDate(day, numericValue, year);
  };

  const handleYearChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Limit to 4 digits and reasonable range
    if (numericValue.length <= 4) {
      // Don't validate incomplete years to allow typing
      if (numericValue.length < 4) {
        setYear(numericValue);
      } else {
        // Only validate complete years
        const yearValue = parseInt(numericValue, 10);
        const currentYear = new Date().getFullYear();
      
        if (yearValue >= 1900 && yearValue <= currentYear) {
          setYear(numericValue);
        }
      }
    }
    
    updateParentDate(day, month, numericValue);
  };

  const updateParentDate = (d: string, m: string, y: string) => {
    // Only update parent if we have valid values for all three fields
    if (d && m && y && y.length === 4) {
      const dateString = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      onDateChange(dateString);
    } else {
      onDateChange('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateInputContainer}>
        <TextInput
          style={styles.dateInput}
          placeholder="DD"
          keyboardType="number-pad"
          maxLength={2}
          value={day}
          onChangeText={handleDayChange}
          placeholderTextColor={theme.colors.ui.black + '70'}
        />
        <Text style={styles.separator}>/</Text>
        <TextInput
          ref={monthInput}
          style={styles.dateInput}
          placeholder="MM"
          keyboardType="number-pad"
          maxLength={2}
          value={month}
          onChangeText={handleMonthChange}
          placeholderTextColor={theme.colors.ui.black + '70'}
        />
        <Text style={styles.separator}>/</Text>
        <TextInput
          ref={yearInput}
          style={styles.yearInput}
          placeholder="YYYY"
          keyboardType="number-pad"
          maxLength={4}
          value={year}
          onChangeText={handleYearChange}
          placeholderTextColor={theme.colors.ui.black + '70'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp("90%"),
  },
  label: {
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.ui.black + '70',
    marginBottom: 5,
    marginLeft: 5,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp("7%"),
    width: wp("90%"),
    borderWidth: 0.2,
    borderColor: theme.colors.brand.blue,
    borderRadius: 5,
    paddingHorizontal: hp("2.3%"),
  },
  dateInput: {
    width: 30,
    height: '100%',
    color: theme.colors.ui.black,
    fontFamily: theme.fontFamily.semiBold,
    textAlign: 'center',
  },
  yearInput: {
    width: 60,
    height: '100%',
    color: theme.colors.ui.black,
    fontFamily: theme.fontFamily.semiBold,
    textAlign: 'center',
  },
  separator: {
    color: theme.colors.ui.black,
    fontFamily: theme.fontFamily.semiBold,
    fontSize: 18,
    marginHorizontal: 5,
  }
});

export default SimpleDatePicker;