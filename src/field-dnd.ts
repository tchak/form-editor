import {
  useDrag,
  useDrop,
  ConnectDragSource,
  ConnectDragPreview,
  ConnectDropTarget,
} from 'react-dnd';

import { Field } from './tree';

const DragItemType = 'Field';

export function useFieldDrag(
  field: Field
): [
  ConnectDragSource,
  ConnectDropTarget,
  ConnectDragPreview,
  { isDragging: boolean; isOver: boolean }
] {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: DragItemType,
      item: field,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [field.id]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragItemType,
      canDrop(item: Field) {
        return item.id != field.id;
      },
      drop(item: Field) {
        item.moveAfter(field);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [field.id]
  );

  return [drag, drop, preview, { isDragging, isOver }];
}
