// register css modules type
declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}
