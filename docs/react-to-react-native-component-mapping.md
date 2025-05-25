# React to React Native Component Mapping

## Core Component Mappings

### HTML Elements → React Native Components

| React (DOM) | React Native | Notes |
|-------------|--------------|-------|
| `<div>` | `<View>` | Default container |
| `<span>` | `<Text>` | Inline text container |
| `<p>`, `<h1-h6>` | `<Text>` | Text with styles |
| `<input type="text">` | `<TextInput>` | Single line input |
| `<textarea>` | `<TextInput multiline>` | Multi-line input |
| `<button>` | `<TouchableOpacity>` + `<Text>` | Pressable element |
| `<img>` | `<Image>` | Image display |
| `<select>` | `<Picker>` or custom modal | Platform-specific |
| `<form>` | `<View>` | No form element needed |
| `<label>` | `<Text>` | Associated with inputs via refs |
| `<ul>`, `<ol>` | `<FlatList>` or `<View>` | List rendering |
| `<table>` | `<View>` with grid layout | Complex layout |

### CSS → StyleSheet

| CSS Property | React Native Style | Notes |
|--------------|-------------------|-------|
| `display: flex` | Default behavior | All Views are flex containers |
| `className` | `style={styles.name}` | Use StyleSheet.create() |
| `onClick` | `onPress` | Touch events |
| `onMouseEnter/Leave` | N/A | No hover states |
| `position: fixed` | `position: 'absolute'` | Limited positioning |
| `overflow: scroll` | `<ScrollView>` | Explicit scroll container |

## Question Type Component Mappings

### 1. Text Input (`SurveyQuestionText`)
```javascript
// React
<input type="text" />
<textarea />

// React Native
<TextInput
  value={this.question.inputValue}
  onChangeText={this.updateValue}
  placeholder={this.question.placeholder}
  editable={!this.question.isReadOnly}
/>
```

### 2. Radio Button (`SurveyQuestionRadiogroup`)
```javascript
// React
<input type="radio" />

// React Native
<TouchableOpacity onPress={() => this.selectItem(item)}>
  <View style={styles.radioOuter}>
    {isSelected && <View style={styles.radioInner} />}
  </View>
  <Text>{item.text}</Text>
</TouchableOpacity>
```

### 3. Checkbox (`SurveyQuestionCheckbox`)
```javascript
// React
<input type="checkbox" />

// React Native
import CheckBox from '@react-native-community/checkbox';
// OR custom implementation
<TouchableOpacity onPress={this.toggleItem}>
  <View style={[styles.checkbox, isChecked && styles.checked]}>
    {isChecked && <Icon name="check" />}
  </View>
</TouchableOpacity>
```

### 4. Dropdown (`SurveyQuestionDropdown`)
```javascript
// React
<select>
  <option />
</select>

// React Native (iOS/Android differ)
// Option 1: Native Picker
<Picker
  selectedValue={this.question.value}
  onValueChange={this.updateValue}
>
  {items.map(item => (
    <Picker.Item label={item.text} value={item.value} />
  ))}
</Picker>

// Option 2: Custom Modal
<TouchableOpacity onPress={this.showPicker}>
  <Text>{selectedText}</Text>
</TouchableOpacity>
<Modal visible={pickerVisible}>
  <FlatList data={items} ... />
</Modal>
```

### 5. Boolean (`SurveyQuestionBoolean`)
```javascript
// React
<input type="checkbox" /> or custom toggle

// React Native
<Switch
  value={this.question.booleanValue}
  onValueChange={this.updateValue}
/>
```

### 6. Rating (`SurveyQuestionRating`)
```javascript
// React
<div>{stars.map(star => <span onClick={...} />)}</div>

// React Native
<View style={styles.ratingContainer}>
  {[1,2,3,4,5].map(value => (
    <TouchableOpacity onPress={() => this.setRating(value)}>
      <Icon name={value <= rating ? "star" : "star-outline"} />
    </TouchableOpacity>
  ))}
</View>
```

### 7. File Upload (`SurveyQuestionFile`)
```javascript
// React
<input type="file" />

// React Native
import DocumentPicker from 'react-native-document-picker';
// OR
import ImagePicker from 'react-native-image-crop-picker';

<TouchableOpacity onPress={this.pickFile}>
  <Text>Choose File</Text>
</TouchableOpacity>
```

### 8. Signature Pad (`SurveyQuestionSignaturePad`)
```javascript
// React
<canvas />

// React Native
import SignatureCanvas from 'react-native-signature-canvas';
// OR custom implementation with:
import { Canvas, Path } from '@shopify/react-native-skia';
```

### 9. Matrix Questions
```javascript
// React
<table>
  <tr><td /></tr>
</table>

// React Native
<View>
  <View style={styles.matrixHeader}>
    {columns.map(col => <Text>{col.text}</Text>)}
  </View>
  {rows.map(row => (
    <View style={styles.matrixRow}>
      <Text>{row.text}</Text>
      {columns.map(col => renderCell(row, col))}
    </View>
  ))}
</View>
```

### 10. Image Picker (`SurveyQuestionImagePicker`)
```javascript
// React
<div>{images.map(img => <img onClick={...} />)}</div>

// React Native
<FlatList
  data={images}
  numColumns={3}
  renderItem={({item}) => (
    <TouchableOpacity onPress={() => this.selectImage(item)}>
      <Image source={{uri: item.imageLink}} />
      {item.selected && <View style={styles.selectedOverlay} />}
    </TouchableOpacity>
  )}
/>
```

## Complex Component Patterns

### Popup/Modal System
```javascript
// React
<div className="popup" style={{position: 'fixed'}}>

// React Native
<Modal
  visible={this.popup.isVisible}
  transparent={true}
  animationType="fade"
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {content}
    </View>
  </View>
</Modal>
```

### Scroll Containers
```javascript
// React
<div style={{overflow: 'auto'}}>

// React Native
<ScrollView
  showsVerticalScrollIndicator={true}
  contentContainerStyle={styles.scrollContent}
>
  {content}
</ScrollView>
```

### Dynamic Lists
```javascript
// React
{items.map(item => <div key={item.id}>{...}</div>)}

// React Native (for performance)
<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={({item}) => <ItemComponent item={item} />}
/>
```

## Platform-Specific Considerations

### iOS vs Android
```javascript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
```

### Keyboard Handling
```javascript
import { KeyboardAvoidingView } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  <ScrollView>
    {surveyContent}
  </ScrollView>
</KeyboardAvoidingView>
```

### Safe Area
```javascript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={styles.container}>
  <Survey model={surveyModel} />
</SafeAreaView>
```

## Navigation Patterns

### Page Navigation
```javascript
// React - Single page app with div swapping
// React Native - Multiple options:

// Option 1: ScrollView with pages
<ScrollView
  horizontal
  pagingEnabled
  scrollEnabled={false}
  ref={scrollViewRef}
>
  {pages.map(page => <SurveyPage />)}
</ScrollView>

// Option 2: Custom page management
<View>
  {pages[currentPageIndex]}
  <View style={styles.navigation}>
    <Button onPress={prevPage} title="Previous" />
    <Button onPress={nextPage} title="Next" />
  </View>
</View>
```

## Event Handling Differences

| React | React Native |
|-------|--------------|
| `onClick` | `onPress` |
| `onChange` (input) | `onChangeText` |
| `onBlur` | `onBlur` |
| `onFocus` | `onFocus` |
| `onKeyDown` | `onKeyPress` (limited) |
| `onMouseEnter` | N/A |
| `onMouseLeave` | N/A |
| `onSubmit` (form) | Custom handler |

## Animation Considerations

```javascript
// React - CSS transitions
// React Native - Animated API

import { Animated } from 'react-native';

const fadeAnim = useRef(new Animated.Value(0)).current;

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start();

<Animated.View style={{opacity: fadeAnim}}>
  {content}
</Animated.View>
```