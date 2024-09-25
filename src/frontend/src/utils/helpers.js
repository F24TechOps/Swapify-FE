import { createZipOrCopy } from "../services/api";

export const toggleCollapse = (category, setCollapsedSections, collapsedSections) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [category]: !collapsedSections[category],
    }));
  };

  export const handleDownload = async (type, company, imageUrls, replaceColor) => {
    try {
      const res = await createZipOrCopy(type, company, imageUrls, replaceColor);
      if (type === "microsite") {
        const text = await res.data.text();
        await navigator.clipboard.writeText(text);
        alert("Microsite Template copied to clipboard");
      } else if (type === "email") {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${company}.zip`);
        document.body.appendChild(link);
        link.click();
      }
    } catch (err) {
      console.error("Error creating zip file:", err);
    }
  };
  