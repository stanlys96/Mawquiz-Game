export function generateRandomString(
  length: number = 8,
  games: Record<string, any>,
  maxAttempts: number = 1000
): string {
  const characters = "0123456789";
  let attempts = 0;

  function helper(): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    if (games[result]) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error(
          "Failed to generate a unique random string after maximum attempts"
        );
      }
      return helper();
    }
    return result;
  }

  return helper();
}

type InputObject = Record<string, any>;

export function objectToArray(
  obj: InputObject,
  keyName: string
): Array<Record<string, any>> {
  return Object.keys(obj).map((key) => ({
    [keyName]: key,
    ...obj[key],
  }));
}
