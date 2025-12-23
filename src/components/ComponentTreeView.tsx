import { useState } from 'react';
import { Button } from '@/components/ui/button';
  CaretDown, 
  Trash,
} from '@phos
import { CONT

  componen
  onSelectComponent: (id: strin
}
export function ComponentTreeView({ 
  selectedId,

  return (
      <div className="flex items
          <Package size={18}
        </div>

 

              <p className="text-sm 
            </
            <
                <Tre
                  c
                  selectedId
          
                />
            </div>
        </div>
    </div>
}
interface Tree
  isSelected

  depth: number;

  component, 
  selectedId,
  onDelete,
}: TreeNodeProps) {
  const hasChildren = component.children && component.children.length > 0;

    const iconM
      'Input': '📝',
      'div': '📦',
      'header': '🎯',
      'main': '🏠',
      'nav': '🧭',
      'h1': 'H1',
      'h3': 'H3',
      'span': '⊕',
      'Checkbox': '☑️',
      'Switch': '🔄',
      'Badge': '🔖
      'Dialog': '
      'Separator':
      'Slide
      'Avatar'
      'Accordion': 
      'Scr
    


        onClick={() => on
          'group flex items-c
          isSelected &
        style={{ paddingLeft
        {hasChildren ? (
            onClick={(e) => {
              se
 

            ) : (
            )
        ) : (
        )}
        <spa
        <sp
        
          {componen

          <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15
          </span>

          <button
              e.stopPropagation();
            }}
            title="D
            <Trash s
        </div>

        <div classNam
            <TreeNode
              compo
              selected
              onDe
            />
        </div>
    </div>
}
























































































              isSelected={selectedId === child.id}
              selectedId={selectedId}










