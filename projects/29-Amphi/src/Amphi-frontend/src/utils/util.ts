import TimeZone from '@/constants/TimeZone.json';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
export const getTimeZoneName = () => {
    let ans: string = '';
    const tzId = dayjs.tz.guess();
    TimeZone.forEach(item => {
        if (tzId === item.timeZoneId) {
            ans = item.timeZoneName;
        }
    });
    return ans;
};

export const formatFileList = (fileList: [any]) => {
    return fileList?.map(file => {
        return {
            fileName: file?.name,
            filePath: file?.response?.data?.path,
            fileType: 0, // 0: 文本， 1：视频， 2：音频
            fileSize: file?.size
        };
    });
};

export const getTotalWorkload = (fileList: [any]) => {
    let total = 0;
    fileList.forEach(file => {
        total += Number(file?.response?.data?.wordCount || 0);
    });
    return total;
};

/* export const isLimitUploadFileNum = (fileList: [any], limit = 10) => {
    const isLt = fileList.length <= limit;
    if (!isLt) {
        message.error('A maximum of 10 files can be uploaded !');
    }
    return isLt;
};
 */

export const selectMap = (value: string | number, maps: { value: string; label: string }[]) => {
    let ans = '';
    maps.forEach(item => {
        if (item.value === value) {
            ans = item.label;
        }
    });
    return ans;
};

export const dateDiff = (
    endTime: string,
    startTime: string = dayjs().format('YYYY-MM-DD HH:mm:ss')
) => {
    const diff = dayjs(endTime).diff(dayjs(startTime), 'hour');
    let res = '';
    if (diff <= 1) {
        res = `1 hour`;
    }
    if (diff > 1 && diff < 24) {
        res = `${diff} hours`;
    }
    if (diff >= 24) {
        res = `${(diff / 24).toFixed(0)} day ${diff % 24} hours`;
    }
    return res;
};
