export default function(min, max) {
    return max ? Math.floor(Math.random() * (max - min + 1)) + min : Math.floor(Math.random() * (min + 1));
}