import { htmlStyle } from './htmlStyle';

export const htmlContent = ({ title, content }: { title: string; content: string }): string => `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=0">
    ${htmlStyle}
</head>
<body>
    <div class="wrapper">
      <div class="title">${title}</div>
      
      <div class="content">${content}</div>
    </div>
</body>
</html>
`;
