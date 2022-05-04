
export type TabType = {
    id: number
    name: string
    linkColor: string
}

export type ItemType = {
    id: number
    word: string
}

export type UteranceType = {
    id: number
    items: Array<ItemType>
}

export type LinkType = {
    id: number
    coordinates: string
    start: number[]
    end: number[]
    startId: string
    endId: string
    highOffset: number
    relType: number
    linkType: string
    level: number
}
