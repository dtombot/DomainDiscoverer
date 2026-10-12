/**
 * Pure client-side domain input helpers.
 * Nothing here queries a registrar, stores a search, or makes a network request.
 */
export const domainPattern = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])$/i;

export function cleanDomain(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split(/[/?#]/)[0]
    .replace(/\.$/, '');
}

export function normalizeDomain(value) {
  const name = cleanDomain(value);
  return name && !name.includes('.') ? name + '.com' : name;
}

const commonSecondLevels = ['.co.uk','.org.uk','.com.au','.net.au','.co.za','.com.ng','.org.ng','.net.ng'];

export function withExtension(value, extension) {
  if (!/^\.[a-z]{2,15}$/.test(extension)) throw new Error('Invalid extension');
  const name = normalizeDomain(value);
  if (!name) return '';
  const ending = commonSecondLevels.find(tld => name.endsWith(tld));
  const base = ending ? name.slice(0,-ending.length) : name.replace(/\.[^.]+$/,'');
  return base + extension;
}
