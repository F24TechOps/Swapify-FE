import { readAndRun } from "./runAll.js";

const update = {
  backgroundColors: {
    color1: {
      oldBackground: "rgb(25, 4, 199)",
      newBackground: "rgb(230, 251, 56)",
    },
    color2: {
      oldBackground: "rgb(255, 255, 255)",
      newBackground: "rgb(0, 0, 0)",
    },
    color3: {
      oldBackground: "rgb(33, 32, 32)",
      newBackground: "rgb(222, 223, 223)",
    },
    color4: {
      oldBackground: "rgb(0, 167, 192)",
      newBackground: "rgb(255, 88, 63)",
    },
    color5: {
      oldBackground: "rgb(41, 105, 176)",
      newBackground: "rgb(214, 150, 79)",
    },
    color6: {
      oldBackground: "rgb(21, 50, 150)",
      newBackground: "rgb(234, 205, 105)",
    },
    color7: {
      oldBackground: "rgb(224, 224, 224)",
      newBackground: "rgb(31, 31, 31)",
    },
    color8: {
      oldBackground: "rgb(50, 72, 152)",
      newBackground: "rgb(205, 183, 103)",
    },
  },
  fontFamily: {
    font1: {
      oldFontFamily: "arial, helvetica, sans-serif",
      newFontFamily: "Garamond",
    },
  },
  images: {
      img1: {
        oldImageSrc: "https://s3.eu-west-2.amazonaws.com/force24-assets/Microsites/ab1ab55c-de0b-4171-ae5e-0161fe7ef607/16748/images/grey4.jpg",
        newImageSrc: "https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg",
      },
      img2: {
        oldImageSrc: "https://s3.eu-west-2.amazonaws.com/force24-assets/Microsites/ab1ab55c-de0b-4171-ae5e-0161fe7ef607/16748/images/textured_dark_grey_dg_foil_27.png",
        newImageSrc: "https://t3.ftcdn.net/jpg/04/40/29/94/360_F_440299419_s4b12RfNDJvpplheVDmKdhFGJiHlAYNs.jpg",
      },
      img3: {
        oldImageSrc: "https://s3.eu-west-2.amazonaws.com/force24-assets/Microsites/ab1ab55c-de0b-4171-ae5e-0161fe7ef607/16748/images/f24-l.png",
        newImageSrc: "https://cdn.freebiesupply.com/logos/large/2x/nike-4-logo-png-transparent.png",
      },
  },
};

const selections = {replaceId: true, flatten: true, update};

readAndRun('./src/html/microsite.html', `src/html/updatedmicrosite${Date.now()}.html`, selections);