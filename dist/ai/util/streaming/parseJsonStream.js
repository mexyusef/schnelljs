import { parseJSON } from "../../core/schema/parseJSON.js";
export function parseJsonStream({ schema, stream, process, onDone, }) {
    function processLine(line) {
        process(parseJSON({ text: line, schema }));
    }
    return (async () => {
        try {
            const reader = new ReadableStreamDefaultReader(stream);
            const utf8Decoder = new TextDecoder("utf-8");
            let unprocessedText = "";
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const { value: chunk, done } = await reader.read();
                if (done) {
                    break;
                }
                unprocessedText += utf8Decoder.decode(chunk, { stream: true });
                const processableLines = unprocessedText.split("\n");
                unprocessedText = processableLines.pop() ?? "";
                processableLines.forEach(processLine);
            }
            // processing remaining text:
            if (unprocessedText) {
                processLine(unprocessedText);
            }
        }
        finally {
            onDone?.();
        }
    })();
}
