// status 对应的状态
// 下面的状态我是简写的，你按UI上的文案来
// 0 pending
// 1  2  3 in service
// 5  completed
// 4  6   cancell
export const ORDER_STATUS_NAME = [
    'Pending payment',
    'In service',
    'In service',
    'In service',
    'Cancelled',
    'Completed',
    'Cancelled'
];
export enum ORDER_STATUS_CODE {
    PENDING = '0',
    IN_SERVICE = '1,2,3',
    COMPLETED = '5',
    CANCELLED = '4,6'
}
