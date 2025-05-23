"use client"
import { ReactNode, createContext, useState } from 'react'
import SimpleDialogModal, { CustomIDialogProps, CUSTOM_INITIAL_DIALOG_PROPS } from 'src/@core/components/molecule/CustomDialogModal'
import CustomDialogModal from 'src/@core/components/molecule/CustomDialogModal'


export type CustomModalValuesType = {
  customSimpleDialogModalProps: CustomIDialogProps
  setCustomSimpleDialogModalProps: (value: CustomIDialogProps) => void
  resetModal: () => void
}

// ** custom
const customDefaultProvider: CustomModalValuesType = {
  customSimpleDialogModalProps: CUSTOM_INITIAL_DIALOG_PROPS,
  setCustomSimpleDialogModalProps: () => CUSTOM_INITIAL_DIALOG_PROPS,
  resetModal: () => {
    // Default empty implementation
  }
}

const CustomModalContext = createContext(customDefaultProvider)

type Props = {
  children: ReactNode
}

const CustomModalProvider = ({ children }: Props) => {
  const [customSimpleDialogModalProps, setCustomSimpleDialogModalProps] = useState<CustomIDialogProps>(
    customDefaultProvider.customSimpleDialogModalProps
  )

  const resetModal = () => {
    setCustomSimpleDialogModalProps(CUSTOM_INITIAL_DIALOG_PROPS)
  }

  const values: CustomModalValuesType = {
    customSimpleDialogModalProps,
    setCustomSimpleDialogModalProps,
    resetModal
  }

  return (
    <CustomModalContext.Provider value={values}>
      <CustomDialogModal
        open={customSimpleDialogModalProps.open}
        onClose={() => {
          resetModal()
        }}
        title={customSimpleDialogModalProps.title}
        contents={customSimpleDialogModalProps.contents}
        isConfirm={customSimpleDialogModalProps.isConfirm}
        actions={customSimpleDialogModalProps.actions}
      />
      {children}
    </CustomModalContext.Provider>
  )
}

export { CustomModalContext, CustomModalProvider }
