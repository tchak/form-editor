import {
  useDrag,
  useDrop,
  ConnectDragSource,
  ConnectDragPreview,
  ConnectDropTarget,
} from 'react-dnd';

import { Field, Section } from './tree';

const DragItemType = 'Field';

export function useSectionDrop() {
  const [, drop] = useDrop(() => ({ accept: DragItemType }));
  return drop;
}

export function useSectionInsertDrop(field: Section) {
  const [, drop] = useDrop(
    () => ({
      accept: DragItemType,
      canDrop: () => false,
      hover(item: Field | Section) {
        if (item != field && !field.content.includes(item)) {
          field.insert(item, field.content.length);
        }
      },
    }),
    [field]
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
      end(item, monitor) {
        const didDrop = monitor.didDrop();
        if (!didDrop) {
        }
      },
    }),
    [field]
  );

  const [, drop] = useDrop(
    () => ({
      accept: DragItemType,
      canDrop: () => false,
      hover(item: Field | Section) {
        if (item.id !== field.id) {
          console.log('hover', item.label);
          item.moveAfter(field);
        }
      },
    }),
    [field]
  );

  return [drag, drop, preview, props];
}
