export default function(number, title1, title2, title3) {
    const titles = [title1, title2, title3];
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
};
