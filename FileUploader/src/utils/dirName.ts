export default () => {
  const dirname = import.meta.dirname;
  if (!dirname) {
    console.log('meta.dirname is not defined');
    return;
  }
  return dirname;
};
