export const theme = {
  name: 'maitademi-theme',
  tokens: {
    colors: {
      pink: {
        10: '#FFF0F5',
        20: '#FFE4EC',
        40: '#FFB6C1',
        60: '#FF69B4',
        80: '#DB7093',
        90: '#C71585',
        100: '#B22222'
      },
      background: {
        primary: '#FFFFFF',
        secondary: '#FFF0F5',
      },
      font: {
        interactive: '#FF69B4',
        hover: '#DB7093',
      }
    },
    components: {
      card: {
        backgroundColor: '{colors.background.primary}',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(219, 112, 147, 0.1)',
        transition: 'all 0.3s ease',
        _hover: {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px rgba(219, 112, 147, 0.2)',
        }
      },
      button: {
        primary: {
          backgroundColor: '{colors.pink.60}',
          color: 'white',
          borderRadius: '25px',
          fontSize: '1rem',
          padding: '12px 24px',
          _hover: {
            backgroundColor: '{colors.pink.80}',
            transform: 'translateY(-2px)',
          }
        }
      },
      heading: {
        color: '{colors.pink.80}',
        fontFamily: '"Playfair Display", serif',
      }
    }
  }
};
