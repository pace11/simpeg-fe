/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/extensions */
import { useCallback, useEffect, useState } from 'react'

import PDFMerger from 'pdf-merger-js/browser'
import ReactDOMServer from 'react-dom/server'

export const useGeneratePDF = (
  callback = { onSuccess: () => {} },
) => {
  const { onSuccess = () => {} } = callback

  const [files, setFiles] = useState([])
  const [countFiles, setCountFiles] = useState(0)
  const [isLoading, setLoading] = useState('')
  const [infoFiles, setInfoFiles] = useState({
    filename: '',
    isUpload: false,
  })

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[arr.length - 1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  const generatePDF = useCallback(
    async ({
      filename = '',
      isUpload = false,
      margin = [20, 30],
      format = 'a4',
      orientation = 'portrait',
      items = [],
    } = {}) => {
      setLoading(true)
      setInfoFiles({
        ...infoFiles,
        filename,
        isUpload,
      })
      try {
        setFiles([])
        setCountFiles(items?.length)
        const html2pdf = (
          await import('html2pdf.js/dist/html2pdf.min.js')
        ).default

        if (items?.length > 0) {
          items?.forEach((el, idx) => {
            const opt = {
              margin,
              filename: `${String(idx)}.pdf`,
              image: { type: 'jpeg', quality: 10 },
              html2canvas: { scale: 5, letterRendering: true },
              jsPDF: { unit: 'pt', format, orientation },
            }

            const printElement = ReactDOMServer.renderToString(
              el?.template,
            )

            html2pdf()
              .set(opt)
              .from(printElement)
              .toPdf()
              .output('datauristring')
              .then((pdfAsString) => {
                setFiles((oldArray) => [
                  ...oldArray,
                  dataURLtoFile(pdfAsString, `${String(idx)}.pdf`),
                ])
              })
          })
        }
      } catch (error) {
        return error
      }
    },
    [],
  )

  const mergerPdf = useCallback(
    async ({ documentFiles = [], info = {} } = {}) => {
      try {
        const merger = new PDFMerger()

        for (const file of documentFiles) {
          await merger.add(file)
        }

        merger.setMetadata({
          producer: 'pdf-merger-js',
        })

        const fileMergerPdf = await merger.saveAsBlob()
        const previewBlob = URL.createObjectURL(
          documentFiles?.length === 1
            ? documentFiles?.[0]
            : fileMergerPdf,
        )
        const file = new File(
          [
            documentFiles?.length === 1
              ? documentFiles?.[0]
              : fileMergerPdf,
          ],
          `${info?.filename}`,
          {
            type: 'application/pdf',
          },
        )

        onSuccess({ preview: previewBlob, result: file, ...info })
      } catch (error) {
        return error
      }
    },
    [],
  )

  useEffect(() => {
    if (files?.length > 0 && files?.length === countFiles) {
      mergerPdf({ documentFiles: files, info: infoFiles })
    }
  }, [files, countFiles, infoFiles?.filename])

  return {
    generatePDF,
    dataURLtoFile,
    isLoading,
    setLoading,
    ...infoFiles,
  }
}
