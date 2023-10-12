export default function parsePHPFile(data: string) {
  let obj = {} as { [index: string]: any };

  try {
    //check if empty
    if (/\s*<\?php\s*return\s*\[\s*\]\s*;/.test(data)) {
      return obj;
    }
    obj = JSON.parse(
      data
        .replaceAll(/\\'/g, `\\\\'`)
        .replaceAll('"', '\\"')
        .replace(/\s*\<\?php\s*return\s*\[\s*'/, '{"')
        .replaceAll(/'\s*=>\s*'/g, '" : "')
        .replaceAll(/'\s*,\s*'/g, '", "')
        .replace(/'\s*,*\s*\]\s*;\s*/, '"}')
    );
    return obj;
  } catch (error) {
    throw new Error('Parse error - ' + error);
  }
}
