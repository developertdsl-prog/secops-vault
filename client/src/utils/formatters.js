export const formatSecretPath = (path) => {
  if (!path) return '';
  return path.replace(/^\/+/, '');
};
