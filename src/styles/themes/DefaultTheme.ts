import { Platform } from 'react-native';

export const DefaultTheme = {
  // Base theme variables (matching CSS variables)
  variables: {
    '--primary-color': '#19b394',
    '--secondary-color': '#ff6771',
    '--background-color': '#f3f3f3',
    '--foreground-color': '#161616',
    '--border-color': '#d6d6d6',
    '--text-color': '#161616',
    '--disabled-color': '#161616',
    '--disabled-background-color': '#f3f3f3',
    '--error-color': '#e60a3e',
    '--success-color': '#19b394',
    '--font-family': Platform.select({ ios: 'System', android: 'Roboto' }),
    '--font-size': 16,
    '--line-height': 24,
    '--panel-spacing': 16,
    '--question-spacing': 12,
    '--base-unit': 8,
    '--border-radius': 4,
  },

  // Component-specific styles
  components: {
    // Root container
    root: {
      backgroundColor: '#ffffff',
      flex: 1,
    },
    
    // Survey container
    survey: {
      container: {
        flex: 1,
      },
      body: {
        paddingHorizontal: 16,
        paddingVertical: 16,
      },
    },

    // Question styles
    question: {
      root: {
        marginBottom: 16,
      },
      content: {
        flex: 1,
      },
      header: {
        marginBottom: 8,
      },
      title: {
        fontSize: 16,
        color: '#161616',
        fontWeight: '600',
        marginBottom: 4,
      },
      requiredText: {
        color: '#e60a3e',
        marginLeft: 4,
      },
      description: {
        fontSize: 14,
        color: '#161616',
        opacity: 0.7,
        marginBottom: 8,
      },
      errorText: {
        color: '#e60a3e',
        fontSize: 14,
        marginTop: 4,
      },
    },

    // Input styles
    input: {
      default: {
        borderWidth: 1,
        borderColor: '#d6d6d6',
        backgroundColor: '#ffffff',
        paddingHorizontal: 12,
        paddingVertical: Platform.select({ ios: 12, android: 8 }),
        borderRadius: 4,
        fontSize: 16,
        color: '#161616',
        minHeight: 44,
      },
      focused: {
        borderColor: '#19b394',
        borderWidth: 2,
      },
      error: {
        borderColor: '#e60a3e',
      },
      disabled: {
        backgroundColor: '#f3f3f3',
        color: '#161616',
        opacity: 0.6,
      },
      multiline: {
        minHeight: 100,
        textAlignVertical: 'top',
      },
    },

    // Button styles
    button: {
      default: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 4,
        backgroundColor: '#19b394',
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
      },
      disabled: {
        backgroundColor: '#d6d6d6',
        opacity: 0.6,
      },
      navigation: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#19b394',
      },
      navigationText: {
        color: '#19b394',
      },
    },

    // Radio and checkbox styles
    choice: {
      item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        minHeight: 44,
      },
      control: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#d6d6d6',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
      },
      controlChecked: {
        borderColor: '#19b394',
      },
      controlInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#19b394',
      },
      checkbox: {
        borderRadius: 4,
      },
      checkboxInner: {
        width: 14,
        height: 14,
        backgroundColor: '#19b394',
        borderRadius: 2,
      },
      label: {
        flex: 1,
        fontSize: 16,
        color: '#161616',
      },
    },

    // Navigation
    navigation: {
      container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
      },
      button: {
        flex: 1,
        marginHorizontal: 4,
      },
    },

    // Progress
    progress: {
      container: {
        height: 4,
        backgroundColor: '#f3f3f3',
        borderRadius: 2,
        marginBottom: 16,
      },
      bar: {
        height: '100%',
        backgroundColor: '#19b394',
        borderRadius: 2,
      },
      text: {
        textAlign: 'center',
        fontSize: 14,
        color: '#161616',
        marginBottom: 8,
      },
    },

    // Panel
    panel: {
      container: {
        marginBottom: 16,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          android: {
            elevation: 2,
          },
        }),
      },
      header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f3f3',
      },
      body: {
        padding: 16,
      },
      title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#161616',
      },
    },

    // Rating
    rating: {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      item: {
        marginHorizontal: 4,
        padding: 8,
      },
      itemSelected: {
        opacity: 1,
      },
      itemUnselected: {
        opacity: 0.3,
      },
    },

    // Matrix
    matrix: {
      container: {
        borderWidth: 1,
        borderColor: '#d6d6d6',
        borderRadius: 4,
        overflow: 'hidden',
      },
      header: {
        flexDirection: 'row',
        backgroundColor: '#f3f3f3',
        borderBottomWidth: 1,
        borderBottomColor: '#d6d6d6',
      },
      headerCell: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
      },
      headerText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#161616',
      },
      row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f3f3',
      },
      cell: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
      },
      labelCell: {
        alignItems: 'flex-start',
      },
    },
  },

  // Responsive breakpoints
  breakpoints: {
    small: 480,
    medium: 768,
    large: 1024,
  },
};