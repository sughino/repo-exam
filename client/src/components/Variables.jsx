import { easeInOut } from "framer-motion";

export const Theme = {
  colors: {
    black: '#060606',
    black10: 'rgba(0, 0, 0, .1)',
    black20: 'rgba(0, 0, 0, .2)',
    black50: 'rgba(0, 0, 0, .5)',
    black80: 'rgba(0, 0, 0, .8)',
  
    white: '#E5EBEA',
    white05: 'rgb(255, 255, 255, .05)',
    white10: 'rgb(255, 255, 255, .1)',
    white20: 'rgb(255, 255, 255, .2)',
    white30: 'rgb(255, 255, 255, .3)',
    white40: 'rgb(255, 255, 255, .4)',
    white50: 'rgb(255, 255, 255, .5)',
    white80: 'rgb(255, 255, 255, .8)',
    
    primary: '#7209b7',
    primary10: 'rgb(114, 9, 183, .1)',
    primary50: 'rgb(114, 9, 183, .5)',
    primaryHover: '#8D0BE4',

    warning: '#f72585',
    warning10: 'rgb(247, 37, 133, .1)',
    warning50: 'rgb(247, 37, 133, .5)',
    warningHover: '#F84596',

    success: '#05f2d2',
    success10: 'rgb(5, 242, 210, .1)',
    successHover: '#20FADD',

    border: '#191919'
  },
  sizes:  {
    gap: 8,
    gap2: 8 * 2,
    gap3: 8 * 3,
    gap4: 8 * 4,
    gap5: 8 * 5,
    gap6: 8 * 6,
    gap7: 8 * 7,
    gap8: 8 * 8,
    radius: 10
  },
  transition: {
    main: {
      duration: 0.5,
      delay: 0,
      ease: [.84,-0.01,.19,.99],
    },
    fast: {
      duration: 0.1,
      delay: 0,
      ease: easeInOut,
    }
  }
}