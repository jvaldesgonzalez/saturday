export namespace TextUtils {
  export function removeLeadingSharpCharacter(
    wordWithSharpMaybe: string,
  ): string {
    if (wordWithSharpMaybe[0] === '#') return wordWithSharpMaybe.slice(1);
    return wordWithSharpMaybe;
  }
}
