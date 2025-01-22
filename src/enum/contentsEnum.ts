export enum PROMO {
  GENERIC_PROMO = 0,
  NO_SMOKING_PROMO = 1
}

export enum CONTENTS_TYPE {
  VIDEO = 3,
  IMAGE = 4,
  UN_KNOWN = 9
}

export const checkFileType = (file: File): CONTENTS_TYPE => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif']
  const videoTypes = ['video/mp4']

  if (imageTypes.includes(file.type)) {
    return CONTENTS_TYPE.IMAGE
  } else if (videoTypes.includes(file.type)) {
    return CONTENTS_TYPE.VIDEO
  } else {
    return CONTENTS_TYPE.UN_KNOWN
  }
}

export const EPath = {
  CONTENTS: '/contents',
  CONTENTS_DETAIL: '/contents/detail'
} as const
