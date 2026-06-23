// React Theme — extracted from https://coderthemes.com
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
    neutral400: string;
    neutral500: string;
    neutral600: string;
    neutral700: string;
    neutral800: string;
    neutral900: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '13': string;
    '14': string;
    '16': string;
    '20': string;
    '28': string;
    '32': string;
    '36': string;
    '42': string;
 *   };
 *   space: {
    '4': string;
    '48': string;
    '54': string;
    '70': string;
    '88': string;
    '95': string;
    '150': string;
    '190': string;
    '200': string;
    '210': string;
    '230': string;
    '308': string;
 *   };
 *   radii: {
    sm: string;
    full: string;
 *   };
 *   shadows: {
    sm: string;
 *   };
 *   states: {
 *     hover: { opacity: number };
 *     focus: { opacity: number };
 *     active: { opacity: number };
 *     disabled: { opacity: number };
 *   };
 * }
 */

export const theme = {
  "colors": {
    "primary": "#2f75d0",
    "secondary": "#ff0000",
    "accent": "#007bff",
    "background": "#ffffff",
    "foreground": "#000000",
    "neutral50": "#000000",
    "neutral100": "#ffffff",
    "neutral200": "#6c757d",
    "neutral300": "#96a6b7",
    "neutral400": "#7c8bad",
    "neutral500": "#444444",
    "neutral600": "#343a40",
    "neutral700": "#495057",
    "neutral800": "#edf0f3",
    "neutral900": "#c1c1c1"
  },
  "fonts": {
    "body": "'hkgrotesk', sans-serif"
  },
  "fontSizes": {
    "13": "13px",
    "14": "14px",
    "16": "16px",
    "20": "20px",
    "28": "28px",
    "32": "32px",
    "36": "36px",
    "42": "42px"
  },
  "space": {
    "4": "4px",
    "48": "48px",
    "54": "54px",
    "70": "70px",
    "88": "88px",
    "95": "95px",
    "150": "150px",
    "190": "190px",
    "200": "200px",
    "210": "210px",
    "230": "230px",
    "308": "308px"
  },
  "radii": {
    "sm": "3px",
    "full": "50px"
  },
  "shadows": {
    "sm": "rgba(0, 0, 0, 0.2) 2px 2px 3px 0px"
  },
  "states": {
    "hover": {
      "opacity": 0.08
    },
    "focus": {
      "opacity": 0.12
    },
    "active": {
      "opacity": 0.16
    },
    "disabled": {
      "opacity": 0.38
    }
  }
};

// MUI v5 theme
export const muiTheme = {
  "palette": {
    "primary": {
      "main": "#2f75d0",
      "light": "hsl(214, 63%, 65%)",
      "dark": "hsl(214, 63%, 35%)"
    },
    "secondary": {
      "main": "#ff0000",
      "light": "hsl(0, 100%, 65%)",
      "dark": "hsl(0, 100%, 35%)"
    },
    "background": {
      "default": "#ffffff",
      "paper": "#fafaff"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#374760"
    }
  },
  "typography": {
    "h1": {
      "fontSize": "32px",
      "fontWeight": "500",
      "lineHeight": "38.4px"
    },
    "h2": {
      "fontSize": "28px",
      "fontWeight": "400",
      "lineHeight": "42px"
    },
    "h3": {
      "fontSize": "20px",
      "fontWeight": "400",
      "lineHeight": "30px"
    },
    "body1": {
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": "18.4px"
    }
  },
  "shape": {
    "borderRadius": 3
  },
  "shadows": [
    "rgba(0, 0, 0, 0.2) 2px 2px 3px 0px"
  ]
};

export default theme;
