export const formatLabel = (key) => {
  const words = key.replace(/([A-Z])/g, " $1").split(" ");

  const number = words[words.length - 1].match(/\d+/);
  if (number) {
    words[words.length - 1] = words[words.length - 1].replace(/\d+/, "");

    const label = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return `${label.trim()} ${parseInt(number[0]) + 1}`;
  } else {
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .trim();
  }
};
