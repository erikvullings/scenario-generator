export const htmlTemplate = ({
  body,
  lang,
  css = cssTable,
}: {
  body: string;
  lang: string;
  css?: string;
}): string => `
<!doctype html>
<html lang="${lang}">
<head>
  ${css}
</head>

<body>
  ${body}
</body>
</html>
`;

export const cssTable = `<style>
td, th {
  text-align: left;
  border: 1px solid black;
  padding: 0.5rem;
}
th {
  background-color:#999;
}
table {
  font-family: Calibri;
  font-size: 11pt;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0.5rem;
}
</style>`;
