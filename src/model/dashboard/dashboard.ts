export interface MVisitant {
  previousDayInOutCount: number
  previousDayInOutTotal: number

  currentDayInOutCount: number
  currentDayInOutTotal: number

  visitantList: MVisitantList[]
}

export interface MVisitantList {
  location: string
  previousDayInOut: number
  currentDayInOut: number
  change: number
}

export const exampleMVisitant: MVisitant = {
  previousDayInOutCount: 100,
  previousDayInOutTotal: 150,
  currentDayInOutCount: 120,
  currentDayInOutTotal: 160,
  visitantList: [
    {
      location: '남문출입구',
      previousDayInOut: 50,
      currentDayInOut: 60,
      change: 20
    },
    {
      location: '북문출입구',
      previousDayInOut: 50,
      currentDayInOut: 60,
      change: 20
    },
    {
      location: '교육동1층입구',
      previousDayInOut: 50,
      currentDayInOut: 60,
      change: 20
    },
    {
      location: '교육동2층입구',
      previousDayInOut: 50,
      currentDayInOut: 60,
      change: 20
    }
  ]
}
