"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import type { DocumentProps, PageProps } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";


const PDF_URL =
  "/api/pdf";

type PdfComponents = {
  Document: ComponentType<DocumentProps>;
  Page: ComponentType<PageProps>;
};

export default function Home() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfComponents, setPdfComponents] = useState<PdfComponents | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPdfRenderer() {
      const { Document, Page, pdfjs } = await import("react-pdf");

      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

      if (isMounted) {
        setPdfComponents({ Document, Page });
      }
    }

    void loadPdfRenderer();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!pdfComponents) {
    return (
      <main className="min-h-screen w-full bg-black">
        <div className="flex min-h-screen items-center justify-center text-white">
          Loading...
        </div>
      </main>
    );
  }

  const { Document, Page } = pdfComponents;

  return (
    <main className="min-h-screen w-full bg-black">
      <div className="flex w-full flex-col items-center">
        <Document
          file={PDF_URL}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="flex min-h-screen items-center justify-center text-white">
              Loading...
            </div>
          }
          error={
            <div className="flex min-h-screen items-center justify-center text-white">
              Failed to load PDF.
            </div>
          }
        >
          {Array.from({ length: numPages }, (_, index) => (
            <div
              key={`page_${index + 1}`}
              className="flex w-full justify-center"
            >
              <Page
                pageNumber={index + 1}
                width={
                  typeof window !== "undefined"
                    ? Math.min(window.innerWidth, 1200)
                    : 1200
                }
                renderTextLayer
                renderAnnotationLayer
              />
            </div>
          ))}
        </Document>
      </div>
    </main>
  );
}