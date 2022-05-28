const axios = require("axios");
const epub = require("epub-gen");

axios
  .get("https://www.ida2at.com/shadow-days-passing-short-story/")
  .then((res) => res.data)
  .then((text) => {
    text = text.slice(text.indexOf("EXTRACTS."));
    text = text.slice(text.indexOf("CHAPTER 1."));

    const lines = text.split("\r\n");
    const content = [];
    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      if (line.startsWith("CHAPTER ")) {
        if (content.length) {
          content[content.length - 1].data =
            content[content.length - 1].data.join("\n");
        }
        content.push({
          title: line,
          data: ["<h2>" + line + "</h2>"],
        });
      } else if (line.trim() === "") {
        if (content[content.length - 1].data.length > 1) {
          content[content.length - 1].data.push("</p>");
        }
        content[content.length - 1].data.push("<p>");
      } else {
        content[content.length - 1].data.push(line);
      }
    }

    const options = {
      title: "Moby-Dick",
      author: "Herman Melville",
      output: "./moby-dick.epub",
      content,
      css: `
      * { text-align: right; direction: rtl; }
    `,
    };

    return new epub(options).promise;
  })
  .then(() => console.log("Done"));
