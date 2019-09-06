export default (dom: string): string => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=0">
    <style type="text/css">
        div{
           max-width: 100%;
           box-sizing: border-box;
        }
        h1{
            text-align: center;
            font-size: 16px;
        }
        input[type="image"],
        img{
            max-width: 100%;
            height: auto !important;
        }
        .container{
            overflow-x: hidden;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        ${dom}
    </div>
</body>
</html>
`;
};
