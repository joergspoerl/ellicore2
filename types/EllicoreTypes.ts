export interface ICurrentDoc {
    
    _id: string,
    _rev: string,

    date: number,
    
    tristar: ITristar,
    bmv: any,
    mk2: any
}

export interface ITristar {
    battsV: number,
    battsI: number,
    rtsTemp: number,
    inPower: number
}

export interface IBmv {
    SOC: number,
    V: number,
    I: number
}


