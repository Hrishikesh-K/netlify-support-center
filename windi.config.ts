// noinspection CssConvertColorToRgbInspection, JSUnusedGlobalSymbols

import type {Plugin} from 'windicss/types/interfaces'
import {defineConfig} from 'windicss/helpers'
import scrollbarPlugin from '@windicss/plugin-scrollbar'
import scrollSnapPlugin from 'windicss/plugin/scroll-snap'
export default defineConfig({
  attributify: {
    prefix: 'w-'
  },
  extract: {
    include: ['./**/*.{html,ts,vue}']
  },
  plugins: [scrollbarPlugin as Plugin, scrollSnapPlugin],
  prefixer: false,
  preflight: false,
  theme: {
    colors: {
      cBlack: '#151a1e',
      cCodeSubtle: '#6e7681',
      cWhite: '#ffffff',
      dBlue100: '#a5befd',
      dBlue200: '#597ef8',
      dBlue300: '#193ed2',
      dBlue400: '#0a1e8f',
      dBlue500: '#040e4e',
      dCodeConstant: '#79c0ff',
      dCodeDefault: '#c9d1d9',
      dCodeEntity: '#7ee787',
      dCodeString: '#a5d6ff',
      dGold100: '#ffeba3',
      dGold200: '#ffd152',
      dGold300: '#e89c02',
      dGold400: '#925a07',
      dGold500: '#4f2f02',
      dGray100: '#e8ebed',
      dGray200: '#a4a8ad',
      dGray300: '#808589',
      dGray400: '#4c5257',
      dGray500: '#2a2e32',
      dGray600: '#22262a',
      dGray700: '#1c2126',
      dPage: '#070b0d',
      dPurple100: '#b7a6fc',
      dPurple200: '#9a72fd',
      dPurple300: '#6d2ff4',
      dPurple400: '#340f85',
      dPurple500: '#1c0849',
      dRed100: '#ffd2bd',
      dRed200: '#ff9785',
      dRed300: '#f85454',
      dRed400: '#941e34',
      dRed500: '#470b1b',
      dTeal100: '#9ff9e1',
      dTeal200: '#86f3df',
      dTeal300: '#31c9c9',
      dTeal400: '#0f6980',
      dTeal500: '#032b3a',
      lBlue100: '#d2e0fe',
      lBlue200: '#799cfb',
      lBlue300: '#2451f5',
      lBlue400: '#112cb0',
      lBlue500: '#061574',
      lCodeConstant: '#0550ae',
      lCodeDefault: '#24292f',
      lCodeEntity: '#116329',
      lCodeString: '#0a3069',
      lGold100: '#fff7d1',
      lGold200: '#ffdd75',
      lGold300: '#ffb914',
      lGold400: '#b7780b',
      lGold500: '#7c4a04',
      lGray100: '#f9fafa',
      lGray200: '#f2f5f8',
      lGray300: '#e8ebed',
      lGray400: '#a4a8ad',
      lGray500: '#808589',
      lGray600: '#676c6f',
      lGray700: '#34383c',
      lPurple100: '#e3dcfe',
      lPurple200: '#a886fd',
      lPurple300: '#7538fa',
      lPurple400: '#3d119c',
      lPurple500: '#230a5c',
      lSeparator: '#0e1e25',
      lRed100: '#ffece0',
      lRed200: '#ffb59e',
      lRed300: '#ff6b61',
      lRed400: '#b5303e',
      lRed500: '#78122d',
      lTeal100: '#e1fef1',
      lTeal200: '#9ff9e1',
      lTeal300: '#5cebdf',
      lTeal400: '#139baa',
      lTeal500: '#054861',
      wCurrent: 'currentColor',
      wNone: 'none',
      wTransparent: 'transparent'
    },
    extend: {
      animation: {
        bg: 'bg',
        border: 'border',
        fill: 'fill',
        line1: 'line1,stroke',
        line2: 'line2,stroke',
        line3: 'line3,stroke',
        line4: 'line4,stroke',
        line5: 'line5,stroke',
        line6: 'line6,stroke',
        stripes: 'stripes',
        logo: 'logo',
        node1: 'node1,fill',
        node2: 'node2,fill',
        node3: 'node3,fill',
        node4: 'node4,fill',
        stroke: 'stroke',
        toZero: 'toZero'
      },
      backgroundImage: {
        dStripes: 'repeating-linear-gradient(112deg,transparent,transparent 15px,rgba(0,0,0,0.1) 0,rgba(0,0,0,0.1) 30px)',
        lStripes: 'repeating-linear-gradient(112deg,transparent,transparent 15px,rgba(255,255,255,0.3) 0,rgba(255,255,255,0.3) 30px)'
      },
      backgroundSize: {
        '300%': '300%'
      },
      boxShadow: {
        dShallow: '0 1px 10px 0 #070b0d99, 0 2px 4px 0 #070b0d66',
        lShallow: '0 1px 10px 0 #34383c0f, 0 2px 4px 0 #34383c14'
      },
      maxWidth: {
        toast: 'calc(100% - 3rem)'
      },
      keyframes: {
        bg: {
          '0%, 70%': {
            'opacity': '0'
          },
          '90%': {
            'opacity': '1'
          },
          '100%': {
            'opacity': '0'
          }
        },
        border: {
          '0%': {
            'stroke-dashoffset': '240'
          },
          '50%, 100%': {
            'stroke-dashoffset': '0'
          },
          '0%, 60%': {
            'opacity': '1'
          },
          '75%, 100%': {
            'opacity': '0'
          }
        },
        fill: {
          '0%, 60%': {
            'fill': '#5cebdf'
          },
          '75%, 100%': {
            'fill': 'var(--logoAnim)'
          }
        },
        line1: {
          '0%, 25%': {
            'stroke-dashoffset': '140'
          },
          '75%, 100%': {
            'stroke-dashoffset': '0'
          }
        },
        line2: {
          '0%, 30%': {
            'stroke-dashoffset': '140'
          },
          '80%, 100%': {
            'stroke-dashoffset': '0'
          }
        },
        line3: {
          '0%, 35%': {
            'stroke-dashoffset': '140'
          },
          '85%, 100%': {
            'stroke-dashoffset': '0'
          }
        },
        line4: {
          '0%, 40%': {
            'stroke-dashoffset': '140'
          },
          '90%, 100%': {
            'stroke-dashoffset': '0'
          }
        },
        line5: {
          '0%, 45%': {
            'stroke-dashoffset': '140'
          },
          '95%, 100%': {
            'stroke-dashoffset': '0'
          }
        },
        line6: {
          '0%, 40%': {
            'stroke-dashoffset': '140'
          },
          '80%, 100%': {
            'stroke-dashoffset': '0'
          }
        },
        stripes: {
          '0%': {
            'background-position': '-32px 0px'
          },
          '100%': {
            'background-position': '0px 0px'
          }
        },
        logo: {
          '0%, 70%': {
            'transform': 'rotate(-45deg) scale(1)'
          },
          '90%': {
            'transform': 'rotate(-45deg) scale(1.15)'
          },
          '95%, to': {
            'transform': 'rotate(-45deg) scale(1)'
          }
        },
        node1: {
          '0%, 30%': {
            'transform': 'scale(0)'
          },
          '40%': {
            'transform': 'scale(1.2)'
          },
          '50%, 100%': {
            'transform': 'scale(1)'
          }
        },
        node2: {
          '0%, 35%': {
            'transform': 'scale(0)'
          },
          '45%': {
            'transform': 'scale(1.2)'
          },
          '55%, 100%': {
            'transform': 'scale(1)'
          }
        },
        node3: {
          '0%, 40%': {
            'transform': 'scale(0)'
          },
          '50%': {
            'transform': 'scale(1.2)'
          },
          '60%, 100%': {
            'transform': 'scale(1)'
          }
        },
        node4: {
          '0%, 45%': {
            'transform': 'scale(0)'
          },
          '55%': {
            'transform': 'scale(1.2)'
          },
          '65%, 100%': {
            'transform': 'scale(1)'
          }
        },
        stroke: {
          '0%, 60%': {
            'stroke': '#5cebdf'
          },
          '75%, 100%': {
            'stroke': 'var(--logoAnim)'
          }
        },
        toZero: {
          '0%': {
            'width': '100%'
          },
          '100%': {
            width: '0'
          }
        }
      },
      screens: {
        'xs': '480px'
      },
      transitionProperty: {
        progress: 'width',
        toast: 'bottom,opacity'
      },
      width: {
        fit: 'fit-content'
      }
    }
  }
})