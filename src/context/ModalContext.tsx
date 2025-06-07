import { ReactNode, createContext, useState } from 'react'
import SimpleDialogModal, { IDialogProps, INITIAL_DIALOG_PROPS } from 'src/@core/components/molecule/SimpleDialogModal'

export type ModalValuesType = {
  simpleDialogModalProps: IDialogProps
  setSimpleDialogModalProps: (value: IDialogProps) => void
  showModal: (props: Omit<IDialogProps, 'open'>) => Promise<boolean>
  resetModal: () => void
}

// ** Defaults
const defaultProvider: ModalValuesType = {
  simpleDialogModalProps: {
    ...INITIAL_DIALOG_PROPS,
    confirmText: '확인',
    cancelText: '취소'
  },
  setSimpleDialogModalProps: () => INITIAL_DIALOG_PROPS,
  showModal: () => Promise.resolve(false),
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

  const showModal = (props: Omit<IDialogProps, 'open'>): Promise<boolean> => {
    return new Promise(resolve => {
      setSimpleDialogModalProps({
        ...props,
        open: true,
        confirmFn: () => {
          props.confirmFn?.()
          resolve(true)
        },
        resolve
      })
    })
  }

  const values: ModalValuesType = {
    simpleDialogModalProps,
    setSimpleDialogModalProps,
    showModal,
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
        resolve={simpleDialogModalProps.resolve}
        size={simpleDialogModalProps.size}
        confirmText={simpleDialogModalProps.confirmText}
        cancelText={simpleDialogModalProps.cancelText}
      />
      {children}
    </ModalContext.Provider>
  )
}

export { ModalContext, ModalProvider }
