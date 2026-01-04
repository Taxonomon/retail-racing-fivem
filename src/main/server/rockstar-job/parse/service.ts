export function parseJobName(json: any): string | undefined {
  return json?.mission?.gen?.nm?.toString();
}

export function parseJobAuthor(json: any): string | undefined {
  return json?.mission?.gen?.ownerId?.toString();
}

export function parseJobDescription(json: any): string | undefined {
  const description: string[] = json?.mission?.gen?.dec;
  return undefined === description ? undefined : description.join('');
}
