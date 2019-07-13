/* eslint-disable */

declare module '*.css' {
  const content: { [key: string]: string };
  export default content;
}

declare module '*.less' {
  const content: { [key: string]: string };
  export default content;
}

declare module '*.json' {
  const data: any;
  export default data;
}

declare module '*.svg' {
  const url: string;
  export default url;
}

declare module '*.jpg' {
  const url: string;
  export default url;
}

declare module '*.png' {
  const url: string;
  export default url;
}

declare module '*.gif' {
  const url: string;
  export default url;
}

declare module '*.ico' {
  const url: string;
  export default url;
}
