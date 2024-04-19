# Swapify Backend Application Setup Guide

## Prerequisites
Before you begin, ensure you have Node.js installed.

## Microsite Setup Instructions

### Step 1: Create Required Directories and Environment File
You need to create a `.env` directory with a nested folder named `json`.

Run the below:

    ```bash
    mkdir -p .env/json
    ```

### Step 2: Create JSON Map
Run the following command to generate the initial JSON map. This map will help in defining the configurations for your microsite.

```bash
node src/back-end/createMap.js
```

After running the script, fill in the JSON file located in the .env/json directory with the necessary changes.

### Step 3: Update Microsite
Once you have made your changes to the JSON configuration file, run the following command to update your microsite:

```bash
node src/back-end/updateMicrosite.js
```

This script will process the updated JSON configurations and apply them to your microsite.

## Email Setup Instructions

### Step 1

### Step 2

### Step 3 

### Conclusion
Feel free to modify any parts of this README to better fit the spec.
