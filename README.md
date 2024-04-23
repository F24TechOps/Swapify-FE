# Swapify Backend Application Setup Guide

## Prerequisites
Before you begin, ensure you have Node.js installed.

## Creating New Templates

### Step 1: Create the Mapping JSON file

Run the following command to generate the initial JSON map. This map will help in defining the configurations for your email or microsite.

```bash
npm run map {type} {company}
```

Where type is either email or microsite. For example `npm run map email force24`.

### Step 2: Fill in the JSON

Open JSON map can be found in `./.env/{company}/{type}/json/mapping.json`.

The JSON will look something like this:

```{
  "backgroundColors": {
    "Background0": {
      "oldBackground": "rgb(112, 199, 213)",
      "newBackground": null
    }
  }
}
```

If you want to replace the background colour you can put the new colour for the key 'newBackground'. This can be either using rgb values as displayed in the old background, HEX values such as #FF0000 or just the name of the colour.

```{
  "backgroundColors": {
    "Background0": {
      "oldBackground": "rgb(112, 199, 213)",
      "newBackground": "#56F12D"
    }
  }
}
```

The same logic applies to fonts, font colours, font sizes and image sources (For emails you can leave the image sources alone). If you want to leave a variable as it is just leave the null value.

None of these will affect any of the button stylings.

### Step 3: Format buttons

In the same JSON file there will be a section regarding buttons. It will look like this:

```"Button2": {
      "innerButton": {
        "background": "rgb(81,142,206)",
        "border-radius": "0px",
        "color": "rgb(237,237,237)",
        "font-family": "Arial,'HelveticaNeue',Helvetica,sans-serif",
        "font-size": "16px",
        "font-style": "normal",
        "font-weight": "bold",
        "line-height": "1.2",
        "text-align": "center",
        "text-decoration": "none",
        "display": "block"
      },
      "outerButton": {
        "background-color": "#518ece",
        "border-radius": "0px",
        "border": "2pxSolid#518ece",
        "padding": "10px30px"
      }
}
```

This is an example for an email for microsites there will be no inner or outer button. Below there should be the new button values filled with nulls. Like before only replace the null values with the styles you want to replace. For backgrounds don't forget to replace the background for the inner button, outer button and border.

If there's a styling you want for every button regardless of its original type then you can look at allButtons in the JSON file. As the name suggests this will change every button and remove the hassle of copying and pasting the styling over all of them.

When the everything has been done make sure to save the file in the same location.

### Step 3: Swap

Once you have made your changes to the JSON configuration file, run the following command to update your HTML:

```
npm run swap {type} {company}
```

This script will process the updated JSON configurations and apply them to your HTML. You can find the new HTML in the directory `./.env/{company}/{type}/final`. For emails there will be a separate images folder.


### (Email Only) Step 4: Gathering Images

In `./.env/{company}/email/final/images` the should be the images that are used in every template for example the social media icons. There are 5 pictures of a star rating. You can edit the colour of these images to match the one of the company colours.

```
npm run star {company} {colour}
```

For example `npm run star force24 '#518ece'`. Please use quotes for the colour.

You will need an additional three images called `landscape.png`, `portrait.png` and `circle.png`.

If you don't have a circle image you can create one.

```
npm run circle {company} {image path}
```

The image path is the location of the image the circle will be made out of. By default it will use portrait.png.

### (Email only) Step 5: Uploading onto the Platform

The final step is to upload the email template. First we need a .zip file containing the content and the images. This can be done by running the following:

```
npm run zip {company} {destination}
```

The destination deafults to `./.env/${company}/email/final/${company}.zip`.

When the .zip is created upload it onto the Force24 Platform.

### Conclusion
Feel free to modify any parts of this README to better fit the spec.
