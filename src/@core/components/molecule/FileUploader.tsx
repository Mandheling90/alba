import React, { forwardRef } from 'react'

interface IFileUploader {
  onFileSelect: (file: File) => void
  accept?: string
  style?: React.CSSProperties
}

const FileUploader = forwardRef<HTMLInputElement, IFileUploader>(
  ({ onFileSelect, accept = 'image/*', style = { display: 'none' } }, ref) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        onFileSelect(file)
      }
    }

    return <input type='file' ref={ref} style={style} accept={accept} onChange={handleFileChange} />
  }
)

FileUploader.displayName = 'FileUploader'

export default FileUploader
