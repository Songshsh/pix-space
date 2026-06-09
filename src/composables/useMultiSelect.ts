/**
 * 通用多选 composable：提供 toggle 选中/取消、清空等基础操作。
 * 支持任意的 { id: string | number } 类型。
 */
export function useMultiSelect<T extends { id: string | number }>() {
  const selectedIds = ref<T['id'][]>([]);
  const selectedSet = ref<Set<T['id']>>(new Set());

  watch(selectedIds, (ids) => {
    selectedSet.value = new Set(ids as T['id'][]);
  });

  const toggle = (item: T) => {
    const id = item.id;
    const ids = selectedIds.value as T['id'][];
    const index = ids.indexOf(id);
    if (index > -1) {
      ids.splice(index, 1);
    } else {
      ids.push(id);
    }
  };

  const clear = () => {
    selectedIds.value = [];
  };

  return { selectedIds, selectedSet, toggle, clear };
}
