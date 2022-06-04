export function loadImage(url = "", fn) {
    let img = new Image();

    if(fn !== undefined){
        img.onload = fn;
    }

    img.src = url;
}