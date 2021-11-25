export function camelToSpace(str: string) {
  const cleanedUp = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  return cleanedUp.charAt(0).toUpperCase() + cleanedUp.slice(1);
}
