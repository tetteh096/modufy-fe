/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(214, 63%, 97%)',
            '100': 'hsl(214, 63%, 94%)',
            '200': 'hsl(214, 63%, 86%)',
            '300': 'hsl(214, 63%, 76%)',
            '400': 'hsl(214, 63%, 64%)',
            '500': 'hsl(214, 63%, 50%)',
            '600': 'hsl(214, 63%, 40%)',
            '700': 'hsl(214, 63%, 32%)',
            '800': 'hsl(214, 63%, 24%)',
            '900': 'hsl(214, 63%, 16%)',
            '950': 'hsl(214, 63%, 10%)',
            DEFAULT: '#2f75d0'
        },
        secondary: {
            '50': 'hsl(0, 100%, 97%)',
            '100': 'hsl(0, 100%, 94%)',
            '200': 'hsl(0, 100%, 86%)',
            '300': 'hsl(0, 100%, 76%)',
            '400': 'hsl(0, 100%, 64%)',
            '500': 'hsl(0, 100%, 50%)',
            '600': 'hsl(0, 100%, 40%)',
            '700': 'hsl(0, 100%, 32%)',
            '800': 'hsl(0, 100%, 24%)',
            '900': 'hsl(0, 100%, 16%)',
            '950': 'hsl(0, 100%, 10%)',
            DEFAULT: '#ff0000'
        },
        accent: {
            '50': 'hsl(211, 100%, 97%)',
            '100': 'hsl(211, 100%, 94%)',
            '200': 'hsl(211, 100%, 86%)',
            '300': 'hsl(211, 100%, 76%)',
            '400': 'hsl(211, 100%, 64%)',
            '500': 'hsl(211, 100%, 50%)',
            '600': 'hsl(211, 100%, 40%)',
            '700': 'hsl(211, 100%, 32%)',
            '800': 'hsl(211, 100%, 24%)',
            '900': 'hsl(211, 100%, 16%)',
            '950': 'hsl(211, 100%, 10%)',
            DEFAULT: '#007bff'
        },
        'neutral-50': '#000000',
        'neutral-100': '#ffffff',
        'neutral-200': '#6c757d',
        'neutral-300': '#96a6b7',
        'neutral-400': '#7c8bad',
        'neutral-500': '#444444',
        'neutral-600': '#343a40',
        'neutral-700': '#495057',
        'neutral-800': '#edf0f3',
        'neutral-900': '#c1c1c1',
        background: '#ffffff',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'hkgrotesk',
            'sans-serif'
        ]
    },
    fontSize: {
        '13': [
            '13px',
            {
                lineHeight: '30px',
                letterSpacing: '0.65px'
            }
        ],
        '14': [
            '14px',
            {
                lineHeight: '21px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: '18.4px'
            }
        ],
        '20': [
            '20px',
            {
                lineHeight: '30px'
            }
        ],
        '28': [
            '28px',
            {
                lineHeight: '42px'
            }
        ],
        '32': [
            '32px',
            {
                lineHeight: '38.4px'
            }
        ],
        '36': [
            '36px',
            {
                lineHeight: '54px'
            }
        ],
        '42': [
            '42px',
            {
                lineHeight: '56px'
            }
        ]
    },
    spacing: {
        '2': '4px',
        '24': '48px',
        '27': '54px',
        '35': '70px',
        '44': '88px',
        '75': '150px',
        '95': '190px',
        '100': '200px',
        '105': '210px',
        '115': '230px',
        '154': '308px',
        '95px': '95px'
    },
    borderRadius: {
        sm: '3px',
        full: '50px'
    },
    boxShadow: {
        sm: 'rgba(0, 0, 0, 0.2) 2px 2px 3px 0px'
    },
    screens: {
        xs: '369px',
        sm: '576px',
        md: '768px',
        lg: '992px',
        '1200px': '1200px'
    },
    transitionDuration: {
        '0': '0s',
        '150': '0.15s',
        '300': '0.3s',
        '500': '0.5s'
    },
    transitionTimingFunction: {
        default: 'ease',
        linear: 'linear'
    },
    container: {
        center: true,
        padding: '15px'
    },
    maxWidth: {
        container: '1140px'
    }
},
  },
};
