import pluralFilter from '@/lib/pluralFilter';
import {i18n} from '../plugins/i18n';

export function getDateStr(date) {
    const monthNames = i18n.t('date.months');

    const month = monthNames[date.getMonth()];

    return `${date.getDate()} ${month}`;
}

export function getTimeStr(date) {
    let minutes = date.getMinutes();

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    return `${date.getHours()}:${minutes}`;
}

export function getSimpleHumanDate(timestamp) {
    const curDate = new Date();
    const date = new Date(timestamp);

    const isToday = date.getTime() > new Date().setHours(0, 0, 0);

    if (isToday) {
        return getTimeStr(date);
    }

    const isYesterday = date.getTime() > curDate.setTime(curDate.getTime() - 86400000);

    if (isYesterday) {
        return i18n.t('date.yesterday');
    }

    return getDateStr(date);
}

export function getDateDiff(sec) {
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec - h * 3600) / 60);

    if (sec < 60) {
        return 'только что';
    } else if (sec < 3600) {
        let min = Math.max(0, Math.floor(sec / 60));
        return `${min} мин. назад`;
    } else if (sec < 86400) {
        let hours = Math.max(0, Math.floor(sec / 3600));
        return `${hours} ${pluralFilter(hours, 'час', 'часа', 'часов')} назад`;
    } else {
        let days = Math.max(0, Math.floor(sec / 86400));
        return `${days} ${pluralFilter(days, 'день', 'дня', 'дней')} назад`;
    }
}
