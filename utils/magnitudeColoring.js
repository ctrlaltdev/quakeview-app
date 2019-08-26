export const hsv2rgb = (h, s, v) => {
    let rgb, i, data = [];
    if (s === 0) {
        rgb = [v,v,v]
    } else {
        h = h / 60
        i = Math.floor(h)
        data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))]
        switch(i) {
            case 0:
                rgb = [v, data[2], data[0]]
                break
            case 1:
                rgb = [data[1], v, data[0]]
                break
            case 2:
                rgb = [data[0], v, data[2]]
                break
            case 3:
                rgb = [data[0], data[1], v]
                break
            case 4:
                rgb = [data[2], data[0], v]
                break
            default:
                rgb = [v, data[0], data[1]]
                break
        }
    }
    return '#' + rgb.map((x) => {
        return ("0" + Math.round(x*255).toString(16)).slice(-2)
    }).join('')
}

export const magnitudeColoring = (magnitude) => {
    let h = 0
    let s = 1
    let v = 1

    if (magnitude >= 9) {
        return hsv2rgb(360, s, v)
    } else if (magnitude < 0) {
        magnitude = 0
    }
    
    h = 200 - Math.floor(magnitude * 240) / 9

    return hsv2rgb(h, s, v)
}