/* 批量导入文件 */
const requireApi = import.meta.glob('./interface/*.ts', { eager: true });

const module: { [k: string]: any } = {};
Object.keys(requireApi).forEach((key: string) => {
    if (key === './index.ts' || key === './axios.ts') return;
    Object.assign(module, requireApi[key]);
});
export default module;
