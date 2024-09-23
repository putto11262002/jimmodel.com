import { PDFDoc } from "easy-pdfkit";

export async function writePdfDocToWritableStream(
  doc: PDFDoc,
  output: WritableStream<any>
) {
  // Important: Finalize the PDF content
  doc.end(); // This signals that no more content will be written to the stream.

  const writer = output.getWriter();

  for await (const chunk of doc) {
    // Write each chunk from Node.js ReadableStream to the Web API WritableStream
    await writer.write(chunk);
  }

  // Close the writer when done
  await writer.close();
}
export function columnFormatter({
  width,
  numCols,
  gap,
  doc,
  columnSpans,
}: {
  width: number;
  numCols: number;
  gap: number;
  doc: PDFDoc;
  columnSpans?: number[];
}): { start: number; end: number }[] {
  if (columnSpans && columnSpans.length !== numCols) {
    throw new Error("columnSpans must be the same length as numCols");
  }
  const totalColumnSpans = columnSpans
    ? columnSpans.reduce((a, b) => a + b, 0)
    : 0;
  const columnProps = columnSpans
    ? columnSpans.map((span) => span / totalColumnSpans)
    : Array(numCols).fill(1 / numCols);
  const columnWidths = columnProps.map((prop) => prop * width);
  let offset = doc.getMarginAdjustedZeroX();
  const columns: { start: number; end: number }[] = [];

  for (let i = 0; i < numCols; i++) {
    const start = offset + (i === 0 ? 0 : gap);
    const end = offset + columnWidths[i] - (i === numCols - 1 ? 0 : gap);
    columns.push({ start, end });
    offset += columnWidths[i];
  }
  return columns;
}
