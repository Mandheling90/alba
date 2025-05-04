import { ReactNode, createContext, useState } from 'react'
import SimpleDialogModal, { IDialogProps, INITIAL_DIALOG_PROPS } from 'src/@core/components/molecule/SimpleDialogModal'

export type ModalValuesType = {
  simpleDialogModalProps: IDialogProps
  setSimpleDialogModalProps: (value: IDialogProps) => void

  resetModal: () => void
}

// ** Defaults
const defaultProvider: ModalValuesType = {
  simpleDialogModalProps: INITIAL_DIALOG_PROPS,
  setSimpleDialogModalProps: () => INITIAL_DIALOG_PROPS,
  resetModal: () => {
    // Default empty implementation
  }
}

const ModalContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const ModalProvider = ({ children }: Props) => {
  const [simpleDialogModalProps, setSimpleDialogModalProps] = useState<IDialogProps>(
    defaultProvider.simpleDialogModalProps
  )

  const resetModal = () => {
    setSimpleDialogModalProps(INITIAL_DIALOG_PROPS)
  }

  const values: ModalValuesType = {
    simpleDialogModalProps,
    setSimpleDialogModalProps,
    resetModal
  }

  return (
    <ModalContext.Provider value={values}>
      <SimpleDialogModal
        open={simpleDialogModalProps.open}
        onClose={() => {
          resetModal()
        }}
        title={simpleDialogModalProps.title}
        contents={simpleDialogModalProps.contents}
        isConfirm={simpleDialogModalProps.isConfirm}
        onConfirm={simpleDialogModalProps.confirmFn}
      />
      {children}
    </ModalContext.Provider>
  )
}

export { ModalContext, ModalProvider }
