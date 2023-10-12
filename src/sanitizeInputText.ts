export default function sanitizeText(text: string, wTransInline = false) {
    let result = text;
    if (wTransInline) {
        result = result.replace(/^(["'`])([\s\S]*)\1$/g, "$2");
    }
  return result.replaceAll(/[\n ]{2,}/g, " ").replaceAll(/'/g, "\\'");
}
