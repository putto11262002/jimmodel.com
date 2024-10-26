import { auth, jobUseCase } from "@/config";
import permissions from "@/config/permission";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Check permissions
  await auth({ permission: permissions.jobs.generateJobConfirmationSheet });

  // Get the job ID from parameters
  const { id } = await params;

  // Create a buffer to hold the PDF data
  const chunks: Uint8Array[] = [];

  // Create a writable stream that pushes data to the chunks array
  const writableStream = new WritableStream<Uint8Array>({
    write(chunk) {
      chunks.push(chunk);
    },
    close() {
      console.log("Stream closed");
    },
    abort(err) {
      console.error("Stream aborted", err);
    },
  });

  // Set response headers for PDF download
  const responseHeaders = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="job-confirmation-${id}.pdf"`,
  });

  try {
    // Generate the PDF using the job ID and the writable stream
    await jobUseCase.generateJobConfirmationSheet(id, writableStream);

    // Combine all the chunks into a single buffer
    const pdfBuffer = Buffer.concat(chunks);

    // Return a response with the PDF buffer
    return new Response(pdfBuffer, { headers: responseHeaders });
  } catch (error) {
    console.log(error);
    return new Response("Failed to generate PDF", { status: 500 });
  }
};
