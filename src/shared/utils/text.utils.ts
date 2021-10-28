export namespace TextUtils {
  export function removeLeadingSharpCharacter(
    wordWithSharpMaybe: string,
  ): string {
    if (wordWithSharpMaybe[0] === '#') return wordWithSharpMaybe.slice(1);
    return wordWithSharpMaybe;
  }

  export function escapeAndParse(s: string): unknown {
    return JSON.parse(
      s
        ? s
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t')
        : null,
    );
  }
}
