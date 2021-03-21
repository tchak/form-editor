import {
  useDrag,
  useDrop,
  ConnectDragSource,
  ConnectDragPreview,
  ConnectDropTarget,
} from 'react-dnd';

import { Field, Section } from './tree';

const DragItemType = 'Field';

export function useSectionInsertDrop(field: Section) {
  const [, drop] = useDrop(
    () => ({
      accept: DragItemType,
      canDrop(item: Field | Section) {
        return item != field && !field.content.includes(item);
      },
      drop(item: Field | Section) {
        field.insert(item, field.content.length);
      },
    }),
    [field.id]
  );

  return drop;
}

export function useFieldDrag(
  field: Field
): [
  ConnectDragSource,
  ConnectDropTarget,
  ConnectDragPreview,
  { isDragging: boolean }
] {
  const [props, drag, preview] = useDrag(
    () => ({
      type: DragItemType,
      item: field,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [field.id]
  );

  const [, drop] = useDrop(
    () => ({
      accept: DragItemType,
      canDrop(item: Field) {
        return item.id != field.id;
      },
      drop(item: Field) {
        item.moveAfter(field);
      },
    }),
    [field.id]
  );

  return [drag, drop, preview, props];
}
